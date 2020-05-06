<template>
    <div>
        <Range v-bind={...x} :value="x.value" @input="onInputX" />
        <Range v-bind={...y} :value="y.value" @input="onInputY" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, watch, defineComponent, Ref } from '@vue/composition-api';
import Range from './Range.vue';

export default defineComponent({
    inheritAttrs: false,
    components: { Range },
    props: {
        value: Object,
        x: Object,
        y: Object,
    },
    setup(props: {locked: Ref<boolean>, value: { x: number, y: number }, x: Ref<Object>, y: Ref<Object>}, { emit }) {

        console.log('props', JSON.stringify(props, null, 4), 'value', Object.keys(props.value));

        const locked = ref(!!props.locked);

        watch(locked, () => {
            console.log('watch locked', { x: props.value.x, y: props.value.x });

            emit('input', { x: props.value.x, y: props.value.x });
        });
        
        function onInputX(v: number) {
            if (locked.value) {
                emit('input', { x: v, y: v });
            } else {
                emit('input', { x: v, y: props.value.y });
            }
        }

        function onInputY(v: number) {
            if (locked.value) {
                emit('input', { x: v, y: v });
            } else {
                emit('input', { x: props.value.x, y: v });
            }
        }

        return {
            onInputX,
            onInputY,
        };
    }
});
</script>
