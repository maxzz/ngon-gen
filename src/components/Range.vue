<template>
    <input
        class="uk-range"
        type="range"
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', rnd2(+$event.target.value))"
        tabindex="-1"
    />
</template>

<script lang="ts">
import Vue from "vue";
import { ref } from '@vue/composition-api';
import { rnd2 } from "./../business/types";

export default Vue.extend({
    inheritAttrs: false,
    props: ['value'],
    setup() {
        return {
            rnd2
        };
    }
});
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import '../scss/tm-theme.scss';
@import '../scss/variables-theme.scss';
@import '../scss/mixins-theme.scss';
@import '../scss/form-range.scss';
</style>
