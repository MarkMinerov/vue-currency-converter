<template>
  <div class="currency-converter" :class="sizeClass">
    <slot name="left-input">
      <CurrencyInput
        ref="leftInput"
        :size="size"
        :initialCode="modelValue.currencies[0]"
        :listConfig="listConfig.left"
        :disabled="disabled"
        @focus="modelValue.hasFocus[0] = true"
        @blur="modelValue.hasFocus[0] = false"
      >
        <template #header:before>
          <slot name="header:before" />
        </template>

        <template #header:after>
          <slot name="header:after" />
        </template>

        <template #item:before>
          <slot name="item:before" />
        </template>

        <template #item:after>
          <slot name="item:after" />
        </template>

        <template #header:chevron>
          <slot name="header:chevron" />
        </template>
      </CurrencyInput>
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
        :initialCode="modelValue.currencies[1]"
        :listConfig="listConfig.right"
        :disabled="disabled"
        @focus="modelValue.hasFocus[1] = true"
        @blur="modelValue.hasFocus[1] = false"
      >
        <template #header:before>
          <slot name="header:before" />
        </template>

        <template #header:after>
          <slot name="header:after" />
        </template>

        <template #item:before>
          <slot name="item:before" />
        </template>

        <template #item:after>
          <slot name="item:after" />
        </template>

        <template #header:chevron>
          <slot name="header:chevron" />
        </template>
      </CurrencyInput>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  type Ref,
  computed,
  reactive,
  toRefs,
  useTemplateRef,
  watch,
} from "vue";
import { type CurrencyCode } from "~/composables/useCurrency";
import { useCurrencyAffect } from "~/composables/useCurrencyAffect";
import {
  ApiConfig,
  ApiData,
  DefaultApiResponse,
  ListParams,
  Model,
  RequiredModel,
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
  (e: "request:error", error: unknown): void;
  (e: "request:success", data: Awaited<ReturnType<typeof getRates>>): void;
  (e: "update:modelValue", value: Model): void;
}>();

const props = withDefaults(
  defineProps<
    { modelValue: Model } & Partial<{
      size: Size;
      disableSizing: boolean;
      enableSwap: boolean;
      disableInputOnUnknown: boolean;
      listConfig: Partial<{
        left: Partial<ListParams>;
        right: Partial<ListParams>;
      }>;
      api: Partial<ApiConfig>;
    }>
  >(),
  {
    modelValue: () => ({
      currencies: ["USD", "EUR"],
      values: [0, 0],
      formatValues: ["", ""],
      loading: false,
    }),
    enableSwap: true,
    disableInputOnUnknown: true,
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

const { listConfig, api, size, disableInputOnUnknown } = toRefs(props);
const { data, getRates } = useApi(api);

const modelValue = reactive<RequiredModel>({
  currencies: props.modelValue.currencies || ["USD", "EUR"],
  values: props.modelValue.values || [0, 0],
  formatValues: props.modelValue.formatValues || ["", ""],
  loading: props.modelValue.loading || false,
  hasFocus: [false, false],
  ...props.modelValue,
});

emit("update:modelValue", modelValue);

const sizeClass = computed(() => `currency-converter--${size.value}`);
const disabled = computed(() => unknown.value && disableInputOnUnknown.value);

const swapCurrencies = () => {};

const requestRates = async (code: CurrencyCode) => {
  try {
    modelValue.loading = true;
    const data = await getRates(code);
    emit("request:success", data);
  } catch (e) {
    emit("request:error", e);
  } finally {
    modelValue.loading = false;
  }
};

const leftModel = computed(() => left.value?.model);
const rightModel = computed(() => right.value?.model);

watch(
  () => [leftModel.value?.currency, rightModel.value?.currency],
  (newVal) => {
    const data = [newVal[0], newVal[1]] as [CurrencyCode, CurrencyCode];
    modelValue.currencies = data;
    emit("setCurrencies", data);
    newVal
      .filter((code): code is CurrencyCode => code != null)
      .forEach(async (code) => requestRates(code));
  }
);

watch(
  () => [leftModel.value?.inputValue!, rightModel.value?.inputValue!],
  (newVal) => {
    modelValue.values = newVal.map((v) => parseFloat(v) || 0) as [
      number,
      number
    ];
  }
);

const { unknown } = useCurrencyAffect({
  data,
  inputElement: computed(() => left.value?.currencyInput as HTMLInputElement),
  currencies: computed(() => ({
    from: left.value?.model.currency!,
    to: right.value?.model.currency!,
  })),
  affectedModel: computed({
    get: () => right.value?.model.inputValue || "",
    set: (val) => {
      if (right.value) right.value.model.inputValue = val;
    },
  }),
  modelValue: computed({
    get: () => modelValue.values[0],
    set: (val) => {
      modelValue.values[0] = val;
    },
  }),
});

useCurrencyAffect({
  data,
  inputElement: computed(() => right.value?.currencyInput as HTMLInputElement),
  currencies: computed(() => ({
    from: right.value?.model.currency!,
    to: left.value?.model.currency!,
  })),
  affectedModel: computed({
    get: () => left.value?.model.inputValue || "",
    set: (val) => {
      if (left.value) left.value.model.inputValue = val;
    },
  }),
  modelValue: computed({
    get: () => modelValue.values[1],
    set: (val) => {
      modelValue.values[1] = val;
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
