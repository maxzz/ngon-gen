<template>
    <div>
        <label>
            <input
                class="uk-range"
                type="range"
                v-bind="$attrs"
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
            />
            <div class="gauge-name">
                <div>{{value}}:</div>
                <div>{{label}}</div>
            </div>
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

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/tm-theme.scss';
@import '../scss/variables-theme.scss';
@import '../scss/mixins-theme.scss';
@import '../scss/form-range.scss';

label {
    display: flex;
    align-items: center;
    font-size: .7em;
    line-height: 1.8em;

    .gauge-name {
        display: grid;
        grid-template-columns: 1fr minmax(6em, 1fr);
    }
}

</style>
