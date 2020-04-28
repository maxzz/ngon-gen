<template>
    <div id="app">
        <div class="main">
            <svg viewBox="0 0 14 14" width="100%">
                <path
                    :d="data.d"
                ></path>
                <circle :cx="data.cx" :cy="data.cy" r=".3px" fill=none stroke="green" stroke-width=".1"></circle>
            </svg>
            <div class="right">
                <div class="input-group"> <label><input type="range" v-model="sp.lenInner.x" min="2" max="20"><span class="val">{{sp.lenInner.x}}:</span>Inner len x</label> </div>
                <div class="input-group"> <label><input type="range" v-model="sp.lenInner.y" min="2" max="20"><span class="val">{{sp.lenInner.y}}:</span>Inner len y</label> </div>
                <hr>
                <div class="input-group"> <label><input type="range" v-model="sp.lenOuter.x" min=".2" max="20"><span class="val">{{sp.lenOuter.x}}:</span>Outer len x</label> </div>
                <div class="input-group"> <label><input type="range" v-model="sp.lenOuter.y" min=".2" max="20"><span class="val">{{sp.lenOuter.y}}:</span>Outer len y</label> </div>
                <hr>
                <div class="input-group"> <label><input type="range" v-model="sp.offset.x" min="2" max="20"><span class="val">{{sp.offset.x}}:</span>Offser x</label> </div>
                <div class="input-group"> <label><input type="range" v-model="sp.offset.y" min="2" max="20"><span class="val">{{sp.offset.y}}:</span>Offser y</label> </div>
                <hr>
                <div class="input-group"> <label><input type="range" v-model="sp.nOuter" min="2" max="40"><span class="val">{{sp.nOuter}}:</span># outer</label> </div>
                <div class="input-group"> <label><input type="range" v-model="sp.nInner" min="1" max="30"><span class="val">{{sp.nInner}}:</span> # inner</label> </div>

                <InputRange label="# inner" v-model="sp.nInner" min="1" max="30" att="44" :style2="{color: 'red'}" />
            </div>
        </div>
        <div class="output">
            <textarea cols="30" rows="10" :value="data.d"></textarea>
        </div>
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
        let msg = ref('aa');

        const shapeParams: types.ShapeParams = {
            lenOuter: { x: 5, y: 5 },
            lenInner: { x: 2.2, y: 2.2 },
            offset: { x: 7, y: 7 },
            nOuter: 5,
            nInner: 5,
        };

        const sp = reactive(shapeParams);

        let data = computed(() => {
            return generate(sp);
        });

        return {
            sp,
            data,
        };
    }
});
</script>

<style lang="scss">
body {
    margin: 0;
    box-sizing: border-box;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
    margin: 0 auto;
    max-width: 80vw;
    display: grid;
    grid-template-rows: 1fr 1fr;
}

.main {
    background-color: hsla(146, 50%, 36%, 0.2);
    display: grid;
    grid-template-columns: auto 1fr;
}

svg {
    fill: none;
    stroke: aqua;
    background-color: rgba(255, 0, 0, 0.2);
}

.output textarea {
    width: 100%;
    padding: 0;
    background-color: hsla(96, 100%, 74%, 0.28);

    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 1px #999;
}
</style>
