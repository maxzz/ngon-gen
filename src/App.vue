<template>
    <div id="app">
        <div class="main">
            <svg viewBox="0 0 14 14" class="big-canvas" xmlns="http://www.w3.org/2000/svg">
                <path :d="data.d" />
                <circle class="origin" :cx="data.cx" :cy="data.cy" r=".3px"></circle>
            </svg>
            <div class="right">
                <div class="ranges">
                    <InputRange label="# outer" v-model="sp.nOuter" min="2" max="70" />
                    <InputRange label="# inner" v-model="sp.nInner" min="1" max="30" />

                    <LockedPair 
                        :a='{label: "aa", min: ".2", max: "20", value: sp.lenOuter.x }'
                        :b='{label: "bb", min: ".2", max: "20", value: sp.lenOuter.y }'
                        v-model="sp.lenOuter"
                        :valueA="sp.lenOuter.x"
                        :valueB="sp.lenOuter.y"
                    />
    
                    <div class="range2">
                        <LockButton />
                        <InputRange label="Outer len x" v-model="sp.lenOuter.x" min=".2" max="20" @input="print" />
                        <InputRange label="Outer len y" v-model="sp.lenOuter.y" min=".2" max="20" />
                    </div>

                    <div class="range2">
                        <LockButton />
                        <InputRange label="Inner len x" v-model="sp.lenInner.x" min=".2" max="20" />
                        <InputRange label="Inner len y" v-model="sp.lenInner.y" min=".2" max="20" />
                    </div>
    
                    <div class="range2">
                        <LockButton />
                        <InputRange label="Offset x" v-model="sp.offset.x" min="2" max="20" />
                        <InputRange label="Offset y" v-model="sp.offset.y" min="2" max="20" />
                    </div>
                </div>
                <div class="actions">
                    <input @click="actionSave" type="button" value="Save">
                </div>
            </div>
        </div>
        <div class="output">
            <textarea cols="30" rows="10" :value='`<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">\n    <path d="${data.d}"/>\n</svg>`'></textarea>
        </div>
        <div>
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
        //[
        //{"nOuter":3,"nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}},
        //{"nOuter":4,"nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}},
        //{"nOuter":"11","nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}},
        //{"nOuter":"11","nInner":"5","lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}
        //]

        let shapes = ref<types.ShapeParams[]>([]);

        shapes.value.push({
            nOuter: 3,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
        },
        {
            nOuter: 4,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
        },
        JSON.parse('{"nOuter":"6","nInner":2,"lenOuter":{"x":"3.2","y":"3.2"},"lenInner":{"x":"5.2","y":"5.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":3,"nInner":2,"lenOuter":{"x":"7.2","y":"0.2"},"lenInner":{"x":"3.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
        JSON.parse('{"nOuter":"8","nInner":2,"lenOuter":{"x":"6.2","y":"0.2"},"lenInner":{"x":"3.2","y":"4.2"},"offset":{"x":7,"y":7}}'),
    );

    function actionSave() {
        shapes.value.push(JSON.parse(JSON.stringify(sp)));
    }

    function applyShape(shape: types.ShapeParams) {
        console.log('shape', shape);
        //sp = reactive({...shape});
        //sp = reactive(JSON.parse(JSON.stringify(shape)));
        sp.nOuter= shape.nOuter;
        sp.nInner= shape.nInner;
        sp.lenOuter = shape.lenOuter;
        sp.lenInner = shape.lenInner;
        sp.offset= shape.offset;
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
        let { applyShape, actionSave, shapes } = initShapes(sp);

        function print(e: any) {
            // sp.lenOuter.y = e;
            // console.log('print', e);
        }

        return {
            print,
            sp,
            data,
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

    .range2 {
        display: grid;
        grid-template-columns: min-content 1fr;
        grid-template-rows: min-content min-content;
        margin-top: 1em;

        & > *:nth-child(1) {
            grid-row: 1 / -1;
            align-self: center;
        }

        // grid-template-areas: 
        //     "aa bb"
        //     "aa cc";
        // align-items: center;

        // & > *:nth-child(1) {
        //     grid-area: aa;
        // }
        // & > *:nth-child(2) {
        //     grid-area: bb;
        // }
        // & > *:nth-child(3) {
        //     grid-area: cc;
        // }
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

    .origin {
        fill: none;
        stroke: rgba(255, 0, 0, 0.438);
        stroke-width: .1;
    }
}

.small-canvas {
    width: 64px;
    .origin {
        display: none;
    }
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
