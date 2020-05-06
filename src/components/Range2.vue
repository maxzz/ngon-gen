<template>
    <div>
        <Range v-bind={...x} :value="x.value" @input="onInputX" />
        <Range v-bind={...y} :value="y.value" @input="onInputY" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent, Ref, watch  } from '@vue/composition-api';
import Range from './Range.vue';

export default defineComponent({
    inheritAttrs: false,
    components: { Range },
    props: {
        locked: Boolean,
        value: Object,
        x: Object,
        y: Object,
    },
    setup(props: {locked: Ref<boolean>, value: { x: number, y: number }, x: Ref<Object>, y: Ref<Object>}, { emit }) {

        let shift = 0;

        watch(() => props.locked, () => {
            shift = props.value.x - props.value.y;
        });

        function onInputX(v: number) {
            emit('input', props.locked ? { x: v, y: v - shift } : { x: v, y: props.value.y });
        }

        function onInputY(v: number) {
            emit('input', props.locked ? { x: v + shift, y: v } : { x: props.value.x, y: v });
        }

        return {
            onInputX,
            onInputY,
        };
    }
});
</script>
