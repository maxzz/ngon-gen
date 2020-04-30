<template>
    <div id="app">
        <div class="main">
            <svg viewBox="0 0 14 14" class="big-canvas" xmlns="http://www.w3.org/2000/svg">
                <path :d="data.d" />
                <path class="helper-out-lines" :d="helpers.outLines" />
                <path class="helper-inn-lines" :d="helpers.innLines" />
                <circle class="origin" :cx="data.start.cx" :cy="data.start.cy" r=".3px"></circle>
            </svg>
            <div class="right">
                <div class="ranges">
                    <InputRange label="# outer" v-model="sp.nOuter" min="2" max="70" />
                    <InputRange label="# inner" v-model="sp.nInner" min="1" max="30" />

                    <LockedPair 
                        :x='{label: "Outer len x", min: ".2", max: "20", value: sp.lenOuter.x }'
                        :y='{label: "Outer len y", min: ".2", max: "20", value: sp.lenOuter.y }'
                        v-model="sp.lenOuter"
                    />
    
                    <LockedPair 
                        :x='{label: "Inner len x", min: ".2", max: "20", value: sp.lenInner.x }'
                        :y='{label: "Inner len y", min: ".2", max: "20", value: sp.lenInner.y }'
                        v-model="sp.lenInner"
                    />

                    <br>
                    <InputRange label="Offset x" v-model="sp.offset.x" min="2" max="20" />
                    <InputRange label="Offset y" v-model="sp.offset.y" min="2" max="20" />
                </div>
                <div class="actions">
                    <input @click="actionSave" type="button" value="Save">
                </div>
            </div>
        </div>
        <div class="output">
            <textarea cols="30" rows="10" :value='`<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">\n    <path d="${data.d}"/>\n</svg>`'></textarea>
        </div>
        <div class="previews">
            <div v-for="(shape, index) of shapes" :key=index @click="applyShape(shape)">
                <svg viewBox="0 0 14 14" class="small-canvas">
                    <path :d="generate(shape).d" />
                    <circle class="origin" :cx="data.cx" :cy="data.cy" r=".3px"></circle>
                </svg>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, reactive, computed } from '@vue/composition-api';
import * as types from "./types";
import { generate } from './shape-generator';
import InputRange from './components/InputRange.vue';
import LockButton from './components/LockButton.vue';
import LockedPair from './components/LockedPair.vue';

function initShapes(sp: types.ShapeParams) {
        let shapes = ref<types.ShapeParams[]>([]);

        shapes.value.push({
            nOuter: 3,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
        },
        JSON.parse('{"nOuter":3,"nInner":2,"lenOuter":{"x":"7.2","y":"0.2"},"lenInner":{"x":"3.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"3.2","y":"6.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"4.2","y":"6.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),

        JSON.parse('{"nOuter":4,"nInner":2,"lenOuter":{"x":"0.2","y":"1.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        {
            nOuter: 4,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
        },
        JSON.parse('{"nOuter":"6","nInner":2,"lenOuter":{"x":"3.2","y":"3.2"},"lenInner":{"x":"5.2","y":"5.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"11","nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"11","nInner":"5","lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"8","nInner":2,"lenOuter":{"x":"6.2","y":"0.2"},"lenInner":{"x":"3.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"10","nInner":"6","lenOuter":{"x":"3.2","y":"0.2"},"lenInner":{"x":"3.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"8","nInner":2,"lenOuter":{"x":"6.2","y":"3.2"},"lenInner":{"x":"3.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"8","nInner":"8","lenOuter":{"x":"6.2","y":"6.2"},"lenInner":{"x":"4.2","y":"0.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"8","nInner":"8","lenOuter":{"x":"6.2","y":"6.2"},"lenInner":{"x":"4.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"6.2","y":"4.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"6","nInner":"3","lenOuter":{"x":"5.2","y":"0.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"2.2","y":"4.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"6.2","y":"3.2"},"lenInner":{"x":"2.2","y":"6.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"16","nInner":"2","lenOuter":{"x":"4.2","y":"6.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"8.2","y":"5.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"11","nInner":"2","lenOuter":{"x":"5.2","y":"0.2"},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"6.2","y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":5,"nInner":2,"lenOuter":{"x":"2.2","y":"6.2"},"lenInner":{"x":5.2,"y":"0.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"4","nInner":"6","lenOuter":{"x":"4.2","y":"1.2"},"lenInner":{"x":"5.2","y":"5.2"},"offset":{"x":7,"y":7}}'),
    );

    function actionSave() {
        shapes.value.push(JSON.parse(JSON.stringify(sp)));
    }

    function applyShape(shape: types.ShapeParams) {
        console.log('shape', shape);
        //sp = reactive({...shape});
        //sp = reactive(JSON.parse(JSON.stringify(shape)));
        let upd = JSON.parse(JSON.stringify(shape));
        sp.nOuter= upd.nOuter;
        sp.nInner= upd.nInner;
        sp.lenOuter = upd.lenOuter;
        sp.lenInner = upd.lenInner;
        sp.offset= upd.offset;
    }

    return {
        actionSave,
        applyShape,
        shapes
    };
} //initShapes()

export default Vue.extend({
    name: "App",
    components: { InputRange, LockButton, LockedPair },
    setup() {
        const initialParams: types.ShapeParams = {
            nOuter: 5,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
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
        let { applyShape, actionSave, shapes } = initShapes(sp);

        return {
            sp,
            data,
            helpers,
            actionSave,
            applyShape,
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
    background-color: hsl(261, 100%, 10%);
    padding: .4em;

    display: grid;
    grid-template-rows: 1fr auto;

    .ranges {
        display: grid;
        align-content: start;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
    }
}

.big-canvas, .small-canvas {
    width: 100%;
    background-color: hsl(208, 100%, 95%);
    border: 1px solid rgb(243, 243, 243);

    path {
        fill: none;
        stroke: rgb(7, 85, 105);
        stroke-width: .2;
    }

    .helper-out-lines {
        stroke: rgba(153, 0, 255, 0.4);
        stroke-width: .1;
    }

    .helper-inn-lines {
        stroke: rgba(0, 76, 255, 0.4);
        stroke-width: .1;
    }

    .origin {
        fill: none;
        stroke: rgba(255, 0, 0, 0.4);
        stroke-width: .1;
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
}

.output textarea {
    width: 100%;
    padding: 0;
    background-color: hsl(0, 0%, 99%);
    resize: vertical;

    border: none;
    font-size: .9em;
}
</style>
