<template>
    <div class="range2">
        <LockButton />
        <InputRange v-bind={...a} v-model="a.value" @input="onInputA" />
        <InputRange v-bind={...b} :value="b.value" @input="onInputB" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputRange from './InputRange.vue';
import LockButton from './LockButton.vue';
import { ref, reactive } from '@vue/composition-api';

export default Vue.extend({
    components: { InputRange, LockButton },
    inheritAttrs: false,
    props: ['a', 'b', 'value', 'valueA', 'valueB'],
    setup(props: any, { emit }) {
        function onInputA(e: any) {
            emit('input', { x: e, y: props.value.y });
            console.log('print new =', e, 'value =', JSON.stringify(props.value));
        }

        function onInputB(e: any) {
            emit('input', { x: props.value.x, y: e });
        }

        return {
            onInputA,
            onInputB,
        };
    }    
});
</script>

<style scoped>
</style>
