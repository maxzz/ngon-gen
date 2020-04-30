<template>
    <div class="range2">
        <LockButton />
        <InputRange v-bind={...a} v-model="valueA" @input="onInputA" />
        <InputRange v-bind={...b} v-model="valueB" @input="onInputB" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputRange from './InputRange.vue';
import LockButton from './LockButton.vue';
import { ref } from '@vue/composition-api';

export default Vue.extend({
    components: { InputRange, LockButton },
    inheritAttrs: false,
    props: ['a', 'b', 'value'],
    setup(props: any) {
        const valueA = ref(props.value.x);
        const valueB = ref(props.value.y);

        function onInputA(e: any) {
            props.value.x = e;
            console.log('print new =', e, 'value =', props.value);
        }

        function onInputB(e: any) {
            props.value.y = e;
            console.log('print new =', e, 'value =', props.value);
        }

        return {
            valueA,
            valueB,
            onInputA,
            onInputB,
        };
    }    
});
</script>

<style scoped>
</style>
