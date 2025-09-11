<template>
  <div class="currency-converter">
    <slot name="left-input">
      <CurrencyInput
        ref="leftInput"
        :size="size"
        :initialCode="defaultCodes[0]"
        :listConfig="listConfig.left"
      />
    </slot>

    <slot name="separator">
      <button v-if="enableSwap" class="swap-button" @click="swapCurrencies">
        <slot name="swap-icon">⇄</slot>
      </button>
    </slot>

    <slot name="right-input">
      <CurrencyInput
        ref="rightInput"
        :size="size"
        :initialCode="defaultCodes[1]"
        :listConfig="listConfig.right"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { type Ref, computed, toRefs, useTemplateRef, onMounted } from "vue";
import { type CurrencyCode } from "~/composables/useCurrency";
import { useCurrencyAffect } from "~/composables/useCurrencyAffect";
import {
  ApiConfig,
  ApiData,
  DefaultApiResponse,
  ListParams,
  Size,
} from "~/types";

import CurrencyInput from "./CurrencyInput.vue";
import { useApi } from "~/composables/useApi";

const DEFAULT_API_URL = "https://open.er-api.com/v6/latest";

export type CurrencyInputInstance = InstanceType<typeof CurrencyInput>;

const left = useTemplateRef<CurrencyInputInstance>("leftInput");
const right = useTemplateRef<CurrencyInputInstance>("rightInput");

const emit = defineEmits<{
  (e: "setCurrencies", value: [CurrencyCode, CurrencyCode]): void;
}>();

const props = withDefaults(
  defineProps<
    Partial<{
      size: Size;
      disableSizing: boolean;
      defaultCodes: CurrencyCode[];
      enableSwap: boolean;
      listConfig: Partial<{
        left: Partial<ListParams>;
        right: Partial<ListParams>;
      }>;
      api: Partial<ApiConfig>;
    }>
  >(),
  {
    defaultCodes: () => ["USD", "EUR"],
    enableSwap: true,
    listConfig: () => ({
      left: {},
      right: {},
    }),
    api: () => ({
      cache: 60 * 60 * 1000, // 1 hour
      fetchOptions: {},
      disabled: false,
      url: {
        base: DEFAULT_API_URL,
        builder: (url: string, code?: CurrencyCode) => `${url}/${code}`,
      },
      setter: (response, mutable: Ref<ApiData>) => {
        const resp = response as DefaultApiResponse;
        if (resp.base_code && resp.rates)
          mutable.value[resp.base_code] = resp.rates;
      },
    }),
  }
);

const { defaultCodes, listConfig, api } = toRefs(props);
const { data, getRates } = useApi(api);

const swapCurrencies = () => {};

onMounted(() => {
  defaultCodes.value.forEach(async (code) => await getRates(code));
});

useCurrencyAffect({
  data,
  inputElement: computed(() => left.value?.currencyInput as HTMLInputElement),
  useFormat: computed(() => listConfig.value.left?.useFormat ?? true),
  currencies: computed(() => ({
    from: left.value?.model.currency ?? defaultCodes.value[0],
    to: right.value?.model.currency ?? defaultCodes.value[1],
  })),
  affectedModel: computed({
    get: () => right.value?.model.inputValue || "",
    set: (val) => {
      if (right.value) right.value.model.inputValue = val;
    },
  }),
});

useCurrencyAffect({
  data,
  inputElement: computed(() => right.value?.currencyInput as HTMLInputElement),
  useFormat: computed(() => listConfig.value.right?.useFormat ?? true),
  currencies: computed(() => ({
    from: right.value?.model.currency ?? defaultCodes.value[1],
    to: left.value?.model.currency ?? defaultCodes.value[0],
  })),
  affectedModel: computed({
    get: () => left.value?.model.inputValue || "",
    set: (val) => {
      if (left.value) left.value.model.inputValue = val;
    },
  }),
});

// Left Selector + dropdown + input
// Right selector
// Swap button
// User own API + mapper function
// Debounce input
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
    border: var(--currency-converter-swap-border, none);
    background-color: var(--currency-converter-swap-bg, #fff);
    color: var(--currency-converter-swap-color, #000);
    font-weight: var(--currency-converter-swap-font-weight, bold);
    font-size: var(--currency-converter-swap-font-size, 18px);
    padding: var(--currency-converter-swap-padding, 0 12px);
    cursor: pointer;
  }
}
</style>
