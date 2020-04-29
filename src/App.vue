<template>
    <div id="app">
        <div class="main">
            <svg viewBox="0 0 14 14" class="big-canvas">
                <path :d="data.d" />
                <circle class="origin" :cx="data.cx" :cy="data.cy" r=".3px"></circle>
            </svg>
            <div class="right">
                <div class="ranges">
                    <InputRange label="# outer" v-model="sp.nOuter" min="2" max="70" />
                    <InputRange label="# inner" v-model="sp.nInner" min="1" max="30" />
    
                    <InputRange label="Outer len x" v-model="sp.lenOuter.x" min=".2" max="20" />
                    <InputRange label="Outer len y" v-model="sp.lenOuter.y" min=".2" max="20" />
    
                    <InputRange label="Inner len x" v-model="sp.lenInner.x" min=".2" max="20" />
                    <InputRange label="Inner len y" v-model="sp.lenInner.y" min=".2" max="20" />
    
                    <InputRange label="Offset x" v-model="sp.offset.x" min="2" max="20" />
                    <InputRange label="Offset y" v-model="sp.offset.y" min="2" max="20" />
                </div>
                <div class="actions">
                    <input @click="actionSave" type="button" value="Save">
                </div>
            </div>
        </div>
        <div class="output">
            <textarea cols="30" rows="10" :value='`<svg viewBox="0 0 14 14">\n    <path d="${data.d}"/>\n</svg>`'></textarea>
        </div>
        <div>
            <div v-for="(shape, index) of shapes" :key=index @click="applyShape(shape)">
                <svg viewBox="0 0 14 14" class="small-canvas">
                    <path :d="generate(shape).d" />
                    <circle class="origin" :cx="data.cx" :cy="data.cy" r=".3px"></circle>
                </svg>

            </div>
        </div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>        
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, reactive, computed } from '@vue/composition-api';
import * as types from "./types";
import { generate } from './shape-generator';
import InputRange from './components/InputRange.vue';

export default Vue.extend({
    name: "App",
    components: { InputRange },
    setup() {
        const initialParams: types.ShapeParams = {
            nOuter: 5,
            nInner: 2,
            lenOuter: { x: 2.2, y: 2.2 },
            lenInner: { x: 5.2, y: 5.2 },
            offset: { x: 7, y: 7 },
        };

        let sp = reactive(initialParams);

        let data = computed(() => {
            return generate(sp);
        });

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

        //[{"nOuter":3,"nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}},{"nOuter":4,"nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}},{"nOuter":"11","nInner":2,"lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}},{"nOuter":"11","nInner":"5","lenOuter":{"x":2.2,"y":2.2},"lenInner":{"x":5.2,"y":5.2},"offset":{"x":7,"y":7}}]

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
        });

        return {
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

    border: none;
    font-size: .9em;
}
</style>
