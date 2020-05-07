<template>
    <div class="value-input">
        {{value}}
    <!-- <input v-model="sp.lenOuter.x" type="number"> -->
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        value: Number
    }
});
</script>

<style lang="scss" scoped>

$demed-color: #838383;

.value-input {
    //background-color: rgba(0, 255, 98, 0.281);
    min-width: 3em;
    text-align: center;
    border: 1px dotted $demed-color;
    border-radius: 3px;
    color: $demed-color;
    padding: 3px;
}
</style>
