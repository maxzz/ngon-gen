<template>
    <div class="lock-btn"
        v-bind="$attrs"
        @click="onClick"
    >
        <svg class="i-lock" :class="{locked: checked}" viewBox="0 0 16 16">
            <path v-if="checked" d="M7.5 4v1h-1V4c0-1.5 1.7-3 3.5-3s3.5 1.5 3.5 3v4c0 1.4-1.7 3-3.5 3-1.4 0-2.7-.9-3.3-2h1.2c.4.6 1.3 1 2.1 1 1.3 0 2.5-1 2.5-2V4c0-1-1.2-2-2.5-2S7.5 3 7.5 4zm3 9v-1h-1v1c0 1-1.2 2-2.5 2s-2.5-1-2.5-2V9c0-1 1.2-2 2.5-2 .8 0 1.6.4 2.1 1h1.2C9.7 6.9 8.4 6 7 6 5.2 6 3.5 7.6 3.5 9v4c0 1.4 1.7 3 3.5 3s3.5-1.5 3.5-3z"/>
            <path v-else d="M10 2c1.3 0 2.5 1 2.5 2v4h1V4c0-1.5-1.7-3-3.5-3S6.5 2.5 6.5 4v1h1V4c0-1 1.2-2 2.5-2zm.5 11v-1h-1v1c0 1-1.2 2-2.5 2s-2.5-1-2.5-2V8.3h-1V13c0 1.5 1.7 3 3.5 3s3.5-1.5 3.5-3z"/>
        </svg>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref } from '@vue/composition-api';

export default Vue.extend({
    inheritAttrs: false,
    props: ['value'],
    setup(props, { emit }) {
        const checked = ref(props.value);

        function onClick() {
            checked.value = !checked.value;
            emit('input', checked.value);
        }

        return {
            onClick,
            checked
        }
    }
});
</script>

<style lang="scss" scoped>
    .lock-btn {
        display: flex;
        justify-content: center;
        align-content: center;

        svg {
            width: 16px;
            height: 16px;
        }
    }

    .i-lock {
        fill: white;
        stroke: none;

        transform: rotateZ(-20deg);
        //transition: transform .2s cubic-bezier(0.4, 0, 0.1, 1.29);
    }

    // .locked {
    //     transform: rotateZ(0deg); // somehow has side effect on other (only) unchecked checkboxes
    // }
</style>