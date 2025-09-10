<template>
  <div class="currency-converter">
    <slot name="left-input">
      <CurrencyInput
        ref="leftInput"
        :size="size"
        :initialCode="defaultCodes[0]"
        :listConfig="listConfig.left"
        v-model="leftModel"
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
        v-model="rightModel"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  toRefs,
  useTemplateRef,
  ref,
  type Ref,
  onMounted,
} from "vue";
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

const leftModel = ref<string>("");
const rightModel = ref<string>("");

export type CurrencyInputInstance = InstanceType<typeof CurrencyInput>;

const leftInput = useTemplateRef<CurrencyInputInstance>("leftInput");
const rightInput = useTemplateRef<CurrencyInputInstance>("rightInput");

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
      boundToAvailable: true, // bound component to available currencies in list
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

const swapCurrencies = () => {};

const { data, getRates } = useApi(api);

useCurrencyAffect({
  inputElement: computed(
    () => leftInput.value?.currencyInput as HTMLInputElement
  ),
  affectedModel: rightModel,
  useFormat: computed(() => listConfig.value.left?.useFormat ?? true),
});

onMounted(async () => {
  console.log(await getRates(defaultCodes.value[0]));

  setTimeout(async () => {
    console.log(await getRates(defaultCodes.value[0]));
  }, 2000);
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
