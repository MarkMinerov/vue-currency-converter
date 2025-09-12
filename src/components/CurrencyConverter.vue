<template>
  <div class="currency-converter" :class="sizeClass">
    <slot name="left-input">
      {{ disabled }} {{ unknown }}
      <CurrencyInput
        v-model="leftModel"
        :size="size"
        :disabled="disabled"
        :listConfig="listConfig.left"
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

    <slot name="separator"> </slot>

    <slot name="right-input">
      <CurrencyInput
        v-model="rightModel"
        :size="size"
        :disabled="disabled"
        :listConfig="listConfig.right"
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
import { type Ref, computed, reactive, toRefs, watch } from "vue";
import { type CurrencyCode } from "~/composables/useCurrency";
import { useCurrencyAffect } from "~/composables/useCurrencyAffect";
import {
  ApiConfig,
  ApiData,
  CurrencyInputModel,
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

const emit = defineEmits<{
  (e: "setCurrencies", value: [CurrencyCode, CurrencyCode]): void;
  (e: "update:modelValue", value: Model): void;
  (e: "request:error", error: unknown): void;
  (e: "request:success", data: Awaited<ReturnType<typeof getRates>>): void;
}>();

const props = withDefaults(
  defineProps<
    { modelValue: Model } & Partial<{
      size: Size;
      disableSizing: boolean;
      disableInputOnUnknown: boolean;
      api: Partial<ApiConfig>;
      listConfig: Partial<{
        left: Partial<ListParams>;
        right: Partial<ListParams>;
      }>;
    }>
  >(),
  {
    modelValue: () => ({
      currencies: ["USD", "EUR"],
      values: ["", ""],
      loading: false,
    }),
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
  values: props.modelValue.values || ["", ""],
  loading: false,
  hasFocus: [false, false],
});

const leftModel = computed({
  get: (): CurrencyInputModel => ({
    currency: modelValue.currencies[0],
    value: modelValue.values[0].toString(),
  }),
  set: (val) => {
    modelValue.currencies[0] = val.currency;
    modelValue.values[0] = val.value ? `${parseFloat(val.value)}` : "";
  },
});

const rightModel = computed({
  get: (): CurrencyInputModel => ({
    currency: modelValue.currencies[1],
    value: modelValue.values[1].toString(),
  }),
  set: (val) => {
    modelValue.currencies[1] = val.currency;
    modelValue.values[1] = val.value ? `${parseFloat(val.value)}` : "";
  },
});

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

const sizeClass = computed(() => `currency-converter--${size.value}`);
const disabled = computed(() => unknown.value && disableInputOnUnknown.value);

watch(
  modelValue.currencies,
  (newVal) => {
    emit("setCurrencies", newVal);
    newVal.forEach(async (code) => requestRates(code));
  },
  { immediate: true }
);

const { unknown } = useCurrencyAffect({
  data,
  modelValue: computed(() => leftModel.value.value),
  currencies: computed(() => ({
    from: leftModel.value.currency,
    to: rightModel.value.currency,
  })),
  affectedModel: computed({
    get: () => rightModel.value.value || "",
    set: (val) => {
      rightModel.value.value = val;
    },
  }),
});

// useCurrencyAffect({
//   data,
//   inputElement: computed(() => right.value?.currencyInput as HTMLInputElement),
//   modelValue: computed(() => modelValue.values[1]),
//   currencies: computed(() => ({
//     from: right.value?.model.currency!,
//     to: left.value?.model.currency!,
//   })),
//   affectedModel: computed({
//     get: () => modelValue.values[1] || "",
//     set: (val) => {
//       if (left.value) modelValue.values[1] = val;
//     },
//   }),
// });

emit("update:modelValue", modelValue);
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
}
</style>
