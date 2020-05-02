<template>
    <div class="range2">
        <LockButton v-model="locked" />
        <InputRange v-bind={...x} :value="x.value" @input="onInputX" />
        <InputRange v-bind={...y} :value="y.value" @input="onInputY" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputRange from './InputRange.vue';
import LockButton from './LockButton.vue';
import { ref, reactive, watch } from '@vue/composition-api';

export default Vue.extend({
    components: { InputRange, LockButton },
    inheritAttrs: false,
    props: ['x', 'y', 'value'],
    setup(props: any, { emit }) {

        const locked = ref(false);

        watch(locked, () => {
            emit('input', { x: props.value.x, y: props.value.x })})
        
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
            locked,
            onInputX,
            onInputY,
        };
    }    
});
</script>

<style lang="scss" scoped>
    .range2 {
        margin-top: 1em;

        display: grid;
        // grid-template-columns: min-content 1fr;
        // grid-template-rows: min-content min-content;

        // & > *:nth-child(1) {
        //     grid-row: 1 / -1;
        //     align-self: center;
        // }

        grid-template-areas: 
            "bb aa"
            "cc aa";
        align-items: center;

        & > *:nth-child(1) {
            grid-area: aa;
        }
        & > *:nth-child(2) {
            grid-area: bb;
        }
        & > *:nth-child(3) {
            grid-area: cc;
        }
    }

</style>
