<template>
    <div class="lock-btn"
        v-bind="$attrs"
        @click="onClick"
    >
        <svg v-if="checked" class="i-lock" viewBox="0 0 16 16" width="16" height="16">
            <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"/>
        </svg>

        <svg v-else class="i-lock" viewBox="0 0 16 16" width="16" height="16">
            <path d="M2 6.5C2 5.2 3 4 4 4h4V3H4C2.5 3 1 4.7 1 6.5S2.5 10 4 10h1V9H4C3 9 2 7.8 2 6.5zM13 6h-1v1h1c1 0 2 1.2 2 2.5S14 12 13 12H8.3v1H13c1.5 0 3-1.7 3-3.5S14.5 6 13 6z"/>
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