<template>
    <input 
        class="value-input" 
        :value="value" 
        @input="editChange" 
        @focus="onFocus"
        @keydown.esc="onEsc"
        @keydown.enter="onEnter"
        @keydown.up.prevent="onUp"
        @keydown.down.prevent="onDown"
    >
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent } from '@vue/composition-api';
import { rnd2 } from '@/business/shape-generator';

export default defineComponent({
    props: {
        value: Number
    },
    setup(props, { emit, attrs}) {

        let step = +attrs.step || 1;
        let min = attrs.min && +attrs.min;
        let max = attrs.max && +attrs.max;
        let cachedValue = 0;

        function emitvalue(v: number) {
            v = rnd2(v);
            min && v < min && (v = min);
            max && v > max && (v = max);
            emit('input', v);
        }

        function editChange(event: Event) {
            emitvalue(+(event.target as HTMLInputElement).value);
        }

        function onFocus(event: Event) {
            cachedValue = +(event.target as HTMLInputElement).value;
        }

        function onEsc(event: KeyboardEvent) {
            (event.target as HTMLInputElement).value = ''+cachedValue;
        }

        function onEnter(event: KeyboardEvent) {
            (event.target as HTMLInputElement).blur();
        }

        function onUp(event: KeyboardEvent) {
            let v = +(event.target as HTMLInputElement).value;
            v = event.ctrlKey ? v + 1 : v + step;
            emitvalue(v);
            console.log('up', v);
        }

        function onDown(event: KeyboardEvent) {
            let v = +(event.target as HTMLInputElement).value;
            v = event.ctrlKey ? v - 1 : v - step;
            emitvalue(v);
            console.log('down', v);
        }

        return {
            editChange,
            onFocus,
            onEsc,
            onEnter,
            onUp,
            onDown,
        };
    }
});
</script>

<style lang="scss" scoped>

$demed-color: #838383;

.value-input {
    min-width: 3em;
    text-align: center;
    border: 1px dotted $demed-color;
    border-radius: 3px;
    color: $demed-color;
    padding: 2px;

    //background-color: rgba(0, 255, 98, 0.281);
    background-color: inherit;

    &:focus {
        background-color: white;
    }
}
</style>
