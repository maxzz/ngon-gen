<template>
    <input
        class="uk-range"
        type="range"
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', +$event.target.value)"
    />
</template>

<script lang="ts">
import Vue from "vue";
import { ref } from '@vue/composition-api';

export default Vue.extend({
    inheritAttrs: false,
    props: ['value'],
    setup() {
        return {
        };
    }
});
</script>

<style lang="scss" scoped>
$form-range-thumb-height: 13px;

@import '../scss/variables.scss';
@import '../scss/tm-theme.scss';
@import '../scss/variables-theme.scss';
@import '../scss/mixins-theme.scss';
@import '../scss/form-range.scss';

</style>
