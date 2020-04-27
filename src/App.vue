<template>
    <div id="app">
        <svg viewBox="0 0 14 14" width="340" height="340">
            <path
                :d="data.d"
            ></path>
            <circle :cx="data.cx" :cy="data.cy" r=".3px" fill=none stroke="green" stroke-width=".1"></circle>
        </svg>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref } from '@vue/composition-api';
import { generate } from './shape-generator';

export default Vue.extend({
    name: "App",
    setup() {
        let msg = ref('aa');
        let data = generate();

        return {
            data
        };
    }
});
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

svg {
    fill: none;
    stroke: aqua;
    background-color: rgba(255, 0, 0, 0.2);
}
</style>
