<template>
    <div id="app">
        <div class="main">
            <svg viewBox="0 0 14 14" class="big-canvas" xmlns="http://www.w3.org/2000/svg">
                <path :d="data.d" />
                <path v-if="showLines" class="helper-out-lines" :d="helpers.outLines" />
                <path v-if="showLines" class="helper-inn-lines" :d="helpers.innLines" />
                <circle v-if="showLines" class="origin" :cx="data.start.cx" :cy="data.start.cy" r=".3"></circle>
            </svg>
            <div class="right">
                <div class="ranges">
                    <InputRange label="# outer" v-model="sp.nOuter" min="2" max="70" />
                    <InputRange label="# inner" v-model="sp.nInner" min="1" max="30" />

                    <LockedPair 
                        :x='{label: "Outer len x", min: ".001", max: "20", value: sp.lenOuter.x,  step: ".1" }'
                        :y='{label: "Outer len y", min: ".001", max: "20", value: sp.lenOuter.y,  step: ".1" }'
                        v-model="sp.lenOuter"
                    />
    
                    <LockedPair 
                        :x='{label: "Inner len x", min: ".001", max: "20", value: sp.lenInner.x,  step: ".1" }'
                        :y='{label: "Inner len y", min: ".001", max: "20", value: sp.lenInner.y,  step: ".1" }'
                        v-model="sp.lenInner"
                    />

                    <br>
                    <InputRange label="Offset x" v-model="sp.offset.x" min="2" max="20" step=".1" />
                    <InputRange label="Offset y" v-model="sp.offset.y" min="2" max="20" step=".1" />
                    <InputRange label="Scale" v-model="sp.sceneScale" min=".01" max="4" step=".01" />
                    <!-- <InputRange label="Stroke" v-model="sp.strokeWidth" min=".01" max="4" step=".01" /> -->
                </div>
                <div class="actions">
                    <label><input type="checkbox" @click="toggleLines">Lines</label>
                    <input @click="saveShape" type="button" value="Save">
                </div>
            </div>
        </div>
        <div class="output">
            <textarea cols="30" rows="7" :value='outputSvgText'></textarea>
            <input @click="downloadSvg" type="button" value="Download">
        </div>
        <Draggable class="previews" v-model="shapes" @start="drag=true" @end="drag=false">
            <div v-for="(shape, index) of shapes" :key="shape.id" @click="applyShape(shape)" class="preview">
                <div class="preview-id">{{index + 1}}</div>
                <svg viewBox="0 0 14 14" class="small-canvas">
                    <path :d="generate(shape).d" />
                </svg>
            </div>
        </Draggable>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, reactive, computed } from '@vue/composition-api';
import * as types from "./business/types";
import { generate } from './business/shape-generator';
import { initShapes, uniqueId } from './business/shapes-collection';
import download from 'downloadjs';
import InputRange from './components/InputRange.vue';
import LockedPair from './components/LockedPair.vue';
import Draggable from 'vuedraggable';

export default Vue.extend({
    name: "App",
    components: { InputRange, LockedPair, Draggable },
    setup() {
        const initialParams: types.ShapeParams = {
            nOuter: 5,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
            sceneScale: 1,
            id: uniqueId()
        };

        let sp = reactive(initialParams);
        
        let data = computed(() => generate(sp));
        let helpers = computed(() => {
            const pointsToLines = (arr: [number, number][]) => arr.map(_ => `M${data.value.center.x},${data.value.center.y}L${_[0]},${_[1]}`);

            let inn = data.value.points.filter((_, index) => index % sp.nInner !== 0);
            let innLines = pointsToLines(inn);

            let out = data.value.points.filter((_, index) => index % sp.nInner === 0);
            let outLines = pointsToLines(out);

            return {
                innLines,
                outLines
            };
        });

        let { applyShape, saveShape, shapes } = initShapes(sp);

        const showLines = ref(false);
        const toggleLines = () => { showLines.value = !showLines.value; };

        let outputSvgText = computed(() => {
            return `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">\n    <path d="${data.value.d}"/>\n</svg>`;
        });
        function downloadSvg() {
            download(outputSvgText.value, 'generated.svg', 'text/plain');
        }

        return {
            sp,
            data,
            helpers,
            saveShape,
            applyShape,
            showLines,
            toggleLines,
            outputSvgText,
            downloadSvg,
            generate,
            shapes
        };
    }
});
</script>

<style lang="scss">
body {
    margin: 0;
    box-sizing: border-box;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    background-color: rgb(235, 235, 235);
}

#app {
    margin: 1em auto;
    max-width: 90vw;
    display: grid;
    grid-template-rows: 1fr auto;
    row-gap: .4em;

    background-color: #fff;
    // border: 1px solid rgb(243, 243, 243);
    // border-radius: 5px;
    padding: .4em;
    box-shadow: 1px 1px 1px #999;
}

.main {
    color: white;
    display: grid;
    column-gap: .4em;
    grid-template-columns: auto 1fr;
}

.right {
    display: grid;
    grid-template-rows: 1fr auto;

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

        & > *:first-child {
            flex-grow: 1;
        }

        label {
            display: flex;
            align-items: center;
            font-size: .7rem;
        }
    }
}

$canvas-bkg: hsl(208, 100%, 95%);

.big-canvas, .small-canvas {
    width: 100%;
    background-color: $canvas-bkg;
    border: 1px solid rgb(243, 243, 243);

    path {
        fill: none;
        stroke: rgb(7, 85, 105);
        stroke-width: .2;
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
    .origin {
        display: none;
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
