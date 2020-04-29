<template>
    <div>
        <label>
            <input
                class="uk-range"
                type="range"
                v-bind="$attrs"
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
            />
            <div class="gauge-name">
                <div class="lock-linked">
                    <LockButton v-model="linked" />
                    <!--  -->
                </div>
                <div class="value">{{value}}</div>
                <div class="text">{{label}}</div>
            </div>
        </label>
        <!-- {{printText()}} -->
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import LockButton from './LockButton.vue';
import { ref, watch } from '@vue/composition-api';

export default Vue.extend({
    inheritAttrs: false,
    components: { LockButton },
    props: ["label", "value"],
    setup() {
        const linked = ref(false);

        watch(linked, () => {
            console.log('paerent check', linked.value);
        });

        return {
            linked
        };
    },
    methods: {
        printText() {
            console.log('here');
            return 'Here';
        }
    }
});
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import '../scss/tm-theme.scss';
@import '../scss/variables-theme.scss';
@import '../scss/mixins-theme.scss';
@import '../scss/form-range.scss';

label {
    display: flex;
    align-items: center;
    font-size: .7em;
    line-height: 1.6em;
    margin: .2em;

    $demed-color: #838383;

    .gauge-name {
        display: grid;
        grid-template-columns: 1fr 1fr minmax(6em, 1fr);
        align-items: center;
        column-gap: .4em;

        .lock-linked {
            width: 1em;
        }

        .value {
            min-width: 3em;
            text-align: center;
            border: 1px dotted $demed-color;
            border-radius: 5px;
            color: $demed-color;
        }
    }
}

</style>
