<template>
    <div class="app-wrap debug_">
        <div class="main">
            <svg :viewBox="`0 0 ${sceneSize} ${sceneSize}`" class="big-canvas" xmlns="http://www.w3.org/2000/svg">
                <path :d="data.d" :style="{'stroke-width': sp.stroke}" />
                <path v-if="options.outerLines" class="helper-out-lines" :d="helpers.outLines" />
                <path v-if="options.innerLines" class="helper-inn-lines" :d="helpers.innLines" />
                <circle v-if="options.outerLines" class="origin" :cx="data.start.cx" :cy="data.start.cy" r=".3"></circle>
            </svg>
            <div class="right debug-grid-16_">
                <div class="ranges">
                    <div class="range-group">
                        <Range v-model="sp.nOuter" min="2" max="70" />
                        <div class="range-spacer"></div>

                        <ValueInput v-model="sp.nOuter" min="2" max="70" />
                        <div class="range-label">Outer #</div>
                    </div>

                    <div class="range-group">
                        <Range v-model="sp.nInner" min="1" max="30" />
                        <div class="range-spacer"></div>

                        <ValueInput v-model="sp.nInner" min="1" max="30" />
                        <div class="range-label">Inner #</div>
                    </div>

                    <div class="range-group-2 range-separator">
                        <Range2
                            :x='{label: "Outer len x", min: "-20", max: "20", value: sp.lenOuter.x,  step: ".1" }'
                            :y='{label: "Outer len y", min: "-20", max: "20", value: sp.lenOuter.y,  step: ".1" }'
                            v-model="sp.lenOuter"
                            :locked="locks.outer"
                        />
                        <LockButton v-model="locks.outer" class="range-lock"/>

                        <ValueInput v-model="sp.lenOuter.x" min="-20" max="20" step=".1" />
                        <div class="range-label">Outer len x</div>
                        
                        <ValueInput v-model="sp.lenOuter.y" min="-20" max="20" step=".1" />
                        <div class="range-label">Outer len y</div>
                    </div>

                    <div class="range-group-2 range-separator">
                        <Range2
                            :x='{label: "Inner len x", min: "-20", max: "20", value: sp.lenInner.x,  step: ".1" }'
                            :y='{label: "Inner len y", min: "-20", max: "20", value: sp.lenInner.y,  step: ".1" }'
                            v-model="sp.lenInner"
                            :locked="locks.inner"
                        />
                        <LockButton v-model="locks.inner" class="range-lock"/>

                        <ValueInput v-model="sp.lenInner.x" min="-20" max="20" step=".1" />
                        <div class="range-label">Inner len x</div>
                        
                        <ValueInput v-model="sp.lenInner.y" min="-20" max="20" step=".1" />
                        <div class="range-label">Inner len y</div>
                    </div>

                    <div class="range-group range-separator">
                        <Range v-model="sp.scene.ofsX" min="2" max="20" step=".1" />
                        <div class="range-spacer"></div>

                        <ValueInput v-model="sp.scene.ofsX" min="2" max="20" step=".1" />
                        <div class="range-label">Offset X</div>
                    </div>

                    <div class="range-group">
                        <Range v-model="sp.scene.ofsY" min="2" max="20" step=".1" />
                        <div class="range-spacer"></div>

                        <ValueInput v-model="sp.scene.ofsY" min="2" max="20" step=".1" />
                        <div class="range-label">Offset Y</div>
                    </div>

                    <div class="range-group">
                        <Range v-model="sp.scene.scale" min=".01" max="4" step=".01" />
                        <div class="range-spacer"></div>

                        <ValueInput v-model="sp.scene.scale" min=".01" max="4" step=".01" />
                        <div class="range-label">Scale</div>
                    </div>

                    <div class="range-group range-separator">
                        <Range v-model="sp.stroke" min=".01" max="2" step=".01" />
                        <div class="range-spacer"></div>

                        <ValueInput v-model="sp.stroke" min=".01" max="2" step=".01" />
                        <div class="range-label">Stroke width</div>
                    </div>
                </div>
                <div class="actions">
                    <label><input type="checkbox" @click="toggleOuterLines">Lines outer</label>
                    <label><input type="checkbox" @click="toggleInnerLines">Lines inner</label>
                    <input @click="shapeAddToPreview" type="button" value="Save">
                </div>
            </div>
        </div>
        <div class="output">
            <textarea cols="30" rows="7" :value='outputSvgText'></textarea>
            <input @click="downloadSvg" type="button" value="Download">
        </div>
        <Draggable class="previews" v-model="shapes" @start="drag=true" @end="drag=false">
            <div v-for="(shape, index) of shapes" :key="shape.id" @click="shapeFromPreview(shape)" class="preview">
                <div class="preview-id">{{index + 1}}</div>
                <svg class="small-canvas" viewBox="0 0 14 14">
                    <path :d="generate(shape).d" />
                </svg>
            </div>
        </Draggable>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, reactive, computed, defineComponent } from '@vue/composition-api';
import * as types from "./business/types";
import { generate } from './business/shape-generator';
import { initShapes } from './business/shapes-collection';
import download from 'downloadjs';
import Range from './components/Range.vue';
import Range2 from './components/Range2.vue';
import ValueInput from './components/ValueInput.vue';
import InputRange from './components/InputRange.vue';
import LockedPair from './components/LockedPair.vue';
import LockButton from './components/LockButton.vue';
import Draggable from 'vuedraggable';
import { CONST_N, initialParams, ShapeNgonToSaved } from './business/types';

export default defineComponent({
    name: "App",
    components: { Range, Range2, LockButton, ValueInput, InputRange, LockedPair, Draggable },
    setup() {
        const sp = reactive(initialParams);
        let data = computed(() => generate(sp));

        let helpers = computed(() => {
            const pointsToLines = (arr: [number, number][]) => arr.map(_ => `M${data.value.center.x},${data.value.center.y}L${_[0]},${_[1]}`);

            let innLines = pointsToLines(data.value.points.filter((_, index) => index % sp.nInner !== 0));
            let outLines = pointsToLines(data.value.points.filter((_, index) => index % sp.nInner === 0));
            return {
                innLines,
                outLines
            };
        });

        const outputSvgText = computed(() => {
            return `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">\n    <path d="${data.value.d}"/>\n</svg>`;
        });
        const downloadSvg = () => download(outputSvgText.value, 'generated.svg', 'text/plain');

        let exportShape = computed(() => {
            let shape = ShapeNgonToSaved(sp);
            console.log(shape); //{"na":5,"nb":2,"lna":{"x":2.2,"y":2.2},"lnb":{"x":5.2,"y":5.2},"scn":{"w":14,"h":14},"id":"ka38u7a0"}
            printShapes();
            return { shape };
        });

        function printShapes() {
            let shapeStrs = shapes.value.map(_ => {
                let shape = ShapeNgonToSaved(_);
                return `'${JSON.stringify(shape)}'`;
            });
            let s = `[\n  ${shapeStrs.join(',\n  ')},\n]\n`;
            console.log(s);
        }

        const options = reactive({
                innerLines: false,
                outerLines: false,
                startPoint: false,
        });
        const toggleOuterLines = () => { options.outerLines = !options.outerLines; };
        const toggleInnerLines = () => { options.innerLines = !options.innerLines; };

        const locks = reactive({
            outer: false, 
            inner: false
        });

        let { shapes, shapeAddToPreview, shapeFromPreview } = initShapes(sp);

        return {
            sp,
            data,
            helpers,
            outputSvgText,
            exportShape,

            shapes,
            shapeAddToPreview,
            shapeFromPreview,

            options,
            locks,

            toggleOuterLines,
            toggleInnerLines,
            
            downloadSvg,
            generate,
            
            sceneSize: CONST_N.SCENE_SIZE
        };
    }
});
</script>

<style lang="scss">
//@import '../src/scss/debug.scss';

*, *::before, *::after {
    margin: 0;
    box-sizing: border-box;
}

body {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    background-color: #ebebeb;
}

.app-wrap {
    margin: 1em auto;
    max-width: 96vw;
    display: grid;
    grid-template-rows: 1fr auto;
    row-gap: .4em;

    background-color: #fff;
    border: 1px solid #f7f7f7;
    border-radius: 3px;
    padding: .4em;
    box-shadow: 1px 1px 1px #999;
}

.main {
    color: white;
    display: grid;
    column-gap: .4em;
    grid-template-columns: 1fr auto;
}

.right {
    display: grid;
    grid-template-rows: 1fr auto;
    width: 280px;
    user-select: none;
    background-color: hsl(261, 100%, 10%);
    padding: .4em;
    //font-size: .8rem;

    .ranges {
        display: grid;
        align-content: start;
    }

    .actions {
        display: flex;

        label {
            margin-right: .6em;
            display: flex;
            align-items: center;
            font-size: .7rem;

            & > *:first-child {
                margin: 0 .2rem 0 0;
            }
        }

        :last-child {
            margin-left: auto;
        }
    }
}

$inputSpacing: 6px;

.range-group, .range-group-2 {
    .uk-range {
        width: 10em;
        height: 21px;
    }

    display: grid;
    grid-template-columns: 130px 16px 48px 1fr;
    align-items: center;
    gap: 2px;

    font-size: .7rem;
    margin-bottom: $inputSpacing;

    .range-label {
        padding-left: .4em;
    }
}

.range-group {
    grid-template-rows: 20px;
}

.range-separator {
    border-top: 1px solid rgb(102, 102, 102);
    padding-top: $inputSpacing;
}

.range-group-2 {
    grid-template-rows: repeat(2, 20px);
    row-gap: $inputSpacing;
    grid-template-areas:
        "range-slider lock value-a label-a"
        "range-slider lock value-b label-b";

    & > :first-child {
        grid-area: range-slider;
    }

    .range-lock {
        grid-area: lock;
        align-self: center;
    }

    :nth-child(3) {
        grid-area: value-a;
    }

    :nth-child(4) {
        grid-area: label-a;
    }

    :nth-child(5) {
        grid-area: value-b;
    }

    :nth-child(6) {
        grid-area: label-b;
    }
}

$canvas-bkg: hsl(208, 100%, 95%);

.big-canvas {
    max-height: 70vh;
}

.big-canvas, .small-canvas {
    width: 100%;
    background-color: $canvas-bkg;
    border: 1px solid rgb(243, 243, 243);

    path {
        fill: none;
        stroke: rgb(7, 85, 105);
        //stroke-width: .2; // set with vue
    }

    .helper-out-lines {
        stroke: rgba(153, 0, 255, 0.4);
        stroke-width: .07;
    }

    .helper-inn-lines {
        stroke: rgba(0, 76, 255, 0.4);
        stroke-width: .07;
    }

    .origin {
        fill: none;
        stroke: rgba(255, 0, 0, 0.4);
        stroke-width: .07;
    }
}

$small-canvas-cell-size: 64px;

.small-canvas {
    width: $small-canvas-cell-size;

    path {
        stroke-width: .2;
    }
}

.previews {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax($small-canvas-cell-size, 1fr));

    .preview {
        position: relative;
    }

    .preview-id {
        position: absolute;
        right: 6px;
        bottom: 6px;
        font-size: .6em;
        color: darken($canvas-bkg, 20%);
    }
}

.output {
    position: relative;

    textarea {
        width: 100%;
        padding: 0;
        background-color: hsl(0, 0%, 99%);
        resize: vertical;

        border: none;
        font-size: .9em;
    }

    input {
        position: absolute;
        right: 2px;
        bottom: 20px;
    }
}

</style>
