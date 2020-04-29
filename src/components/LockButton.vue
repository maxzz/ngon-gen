<template>
    <div class="lock-btn"
        v-bind="$attrs"
        @click="onClick"
    >
        <svg class="i-lock" viewBox="0 0 8 14">
            <path d="M6 5V3.5C6 2.12 4.88 1 3.5 1 2.12 1 1 2.12 1 3.5V5H0V3.5C0 1.567 1.567 0 3.5 0 5.433 0 7 1.567 7 3.5V5H6zm1 4H6v1.5C6 11.88 4.88 13 3.5 13 2.12 13 1 11.88 1 10.5V9H0v1.5C0 12.433 1.567 14 3.5 14 5.433 14 7 12.433 7 10.5V9z">
            </path>
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
            console.log('clciked');
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
        background-color: #fff;
    }

    $demed-color: #838383;

    .i-lock {
        fill: $demed-color;

        svg {
            width: 8px;
            height: 12px;
        }
    }
</style>