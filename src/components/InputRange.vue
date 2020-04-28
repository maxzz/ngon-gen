<template>
    <div>
        <label :style="$attrs.style2" >
            <hr/>
            style: {{$attrs.style2}}
            <hr />
            {{label}}
            <hr />
            <input
                type="range"
                :min="min"
                :max="max"
                v-bind="$attrs"
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
            />
        </label>
        {{printText()}}
        {{$attrs}}
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    inheritAttrs: false,
    props: ["label", "value", 'min', 'max'],
    methods: {
        printText() {
            console.log('here');
            return 'Here';
        }
    }
});
</script>

<style scoped>
</style>
