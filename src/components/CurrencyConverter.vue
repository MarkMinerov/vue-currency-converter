<template>
  <div class="currency-converter">
    <CurrencyInput :initialCode="defaultCodes[0]" :size="size" />
    <button v-if="enableSwap" class="swap-button" @click="swapCurrencies">
      ⇄
    </button>
    <CurrencyInput :initialCode="defaultCodes[1]" :size="size" />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import CurrencyInput from "./CurrencyInput.vue";
import { type CurrencyCode } from "~/composables/useCurrency";
import { Size } from "~/types";
// Left Selector + dropdown + input
// Right selector
// Swap button
// User own API + mapper function
// Debounce input

const props = withDefaults(
  defineProps<
    Partial<{
      size: Size;
      disableSizing: boolean;
      defaultCodes: CurrencyCode[];
      enableSwap: boolean;
    }>
  >(),
  {
    defaultCodes: () => ["USD", "EUR"],
    enableSwap: true,
  }
);

const { defaultCodes } = toRefs(props);

const swapCurrencies = () => {};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/layout.scss" as *;

.currency-converter {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: var(--currency-converter-height, 42px);

  * {
    box-sizing: border-box;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif, Courier, monospace;
  }

  .currency-input {
    &:first-child {
      border-top-left-radius: var(--currency-converter-border-radius, 6px);
      border-bottom-left-radius: var(--currency-converter-border-radius, 6px);
    }

    &:last-child {
      border-top-right-radius: var(--currency-converter-border-radius, 6px);
      border-bottom-right-radius: var(--currency-converter-border-radius, 6px);
    }
  }

  .swap-button {
    height: 100%;
    border: var(--currency-converter-swap-border, 1px solid #ccc);
    background-color: var(--currency-converter-swap-bg, #fff);
    color: var(--currency-converter-swap-color, #000);
    font-weight: var(--currency-converter-swap-font-weight, bold);
    font-size: var(--currency-converter-swap-font-size, 18px);
    padding: var(--currency-converter-swap-padding, 0 12px);
    cursor: pointer;
  }
}
</style>
