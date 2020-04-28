<template>
    <div>
        <label>
            <div>{{value}}:</div>
            <div>{{label}}</div>
            <input
                class="uk-range"
                type="range"
                v-bind="$attrs"
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
            />
        </label>
        <!-- {{printText()}} -->
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    inheritAttrs: false,
    props: ["label", "value"],
    methods: {
        printText() {
            console.log('here');
            return 'Here';
        }
    }
});
</script>

<style scoped>
label {
    display: flex;
    align-items: center;
}

.uk-range {
    box-sizing: border-box;
    margin: 0;
    vertical-align: middle;
    max-width: 100%;
    width: 100%;
    -webkit-appearance: none;
    background: transparent;
    padding: 0
}

.uk-range:focus {
    outline: none
}

.uk-range::-moz-focus-outer {
    border: none
}

.uk-range::-ms-track {
    height: 15px;
    background: transparent;
    border-color: transparent;
    color: transparent
}

.uk-range:not(:disabled)::-webkit-slider-thumb {
    cursor: pointer
}

.uk-range:not(:disabled)::-moz-range-thumb {
    cursor: pointer
}

.uk-range:not(:disabled)::-ms-thumb {
    cursor: pointer
}

.uk-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -7px;
    height: 15px;
    width: 15px;
    border-radius: 500px;
    background: #fff;
    border: 1px solid #ccc
}

.uk-range::-moz-range-thumb {
    border: none;
    height: 15px;
    width: 15px;
    border-radius: 500px;
    background: #fff;
    border: 1px solid #ccc
}

.uk-range::-ms-thumb {
    margin-top: 0
}

.uk-range::-ms-thumb {
    border: none;
    height: 15px;
    width: 15px;
    border-radius: 500px;
    background: #fff;
    border: 1px solid #ccc
}

.uk-range::-ms-tooltip {
    display: none
}

.uk-range::-webkit-slider-runnable-track {
    height: 3px;
    background: #ebebeb;
    border-radius: 500px
}

.uk-range:focus::-webkit-slider-runnable-track,.uk-range:active::-webkit-slider-runnable-track {
    background: #d2d2d2
}

.uk-range::-moz-range-track {
    height: 3px;
    background: #ebebeb;
    border-radius: 500px
}

.uk-range:focus::-moz-range-track {
    background: #d2d2d2
}

.uk-range::-ms-fill-lower,.uk-range::-ms-fill-upper {
    height: 3px;
    background: #ebebeb;
    border-radius: 500px
}

.uk-range:focus::-ms-fill-lower,.uk-range:focus::-ms-fill-upper {
    background: #d2d2d2
}

</style>
