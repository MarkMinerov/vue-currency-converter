<template>
  <div
    class="currency-input"
    ref="currencyComp"
    :class="[
      size,
      {
        open: dropdownOpen && !listConfig?.openBlocked,
        reverse: listConfig?.reverse,
        disabled,
      },
    ]"
  >
    <input
      type="text"
      :value="modelValue.value"
      :placeholder="currencyConfig.symbol"
      @input="setVal($event)"
      :disabled="disabled"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />

    <div class="curr-selector">
      <div class="curr-header" @click="switchDropdown()">
        <slot name="header:before" />
        <span class="curr-code">{{ modelValue.currency }}</span>
        <slot name="header:chevron">
          <svg
            v-if="!listConfig?.openBlocked && filteredCurrencies.length > 1"
            class="curr-header__chevron"
            viewBox="0 0 16 16"
          >
            <path
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
        </slot>
        <slot name="header:after" />
      </div>

      <Transition :name="animationName">
        <div
          v-if="dropdownOpen"
          class="curr-body"
          :style="{ maxHeight: `${listHeight}px` }"
        >
          <div
            v-for="item of filteredCurrencies"
            class="item-row"
            :style="{ height: `${itemHeightComp}px` }"
            :key="item.code"
            :class="{ selected: item.code === modelValue.currency }"
            @click="selectItem(item)"
          >
            <slot name="item:before" />
            <span v-if="!listConfig?.item?.hideCode" class="item-row__code">{{
              item.code
            }}</span>
            <span v-if="!listConfig?.item?.hideName" class="item-row__name">{{
              item.name
            }}</span>
            <span
              v-if="!listConfig?.item?.hideSymbol && item.symbol !== item.code"
              class="item-row__symbol"
              >{{ item.symbol }}</span
            >
            <slot name="item:after" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "~/composables/onClickOutside";
import { ref, toRefs, computed, useTemplateRef, onMounted } from "vue";
import { CurrencyCode, useCurrency } from "~/composables/useCurrency";
import { CurrencyConfig, CurrencyInputModel, ListParams, Size } from "~/types";

const DEFAULT_ITEMS_PER_VIEW = 5;

const props = withDefaults(
  defineProps<
    {
      modelValue: CurrencyInputModel;
    } & Partial<{
      listConfig: Partial<ListParams>;
      itemHeight: number;
      size: Size;
      disabled: boolean;
    }>
  >(),
  {
    disabled: false,
    listConfig: () => ({
      itemsPerView: DEFAULT_ITEMS_PER_VIEW,
      reverse: false,
      needFormat: true,
      openBlocked: false,
      item: {
        hideCode: false,
        hideName: false,
        hideSymbol: false,
      },
    }),
  }
);

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: {
      value: string;
      currency: CurrencyCode;
    }
  ): void;
  (
    e: "update:selectCurrency",
    value: { newVal: CurrencyCode; oldVal: CurrencyCode }
  ): void;
  (e: "focus"): void;
  (e: "blur"): void;
}>();

const rowSizes = {
  sm: 32,
  md: 36,
  lg: 48,
  xl: 52,
  xxl: 56,
};

const currencyComp = useTemplateRef<HTMLElement>("currencyComp");

onClickOutside(currencyComp, () => {
  dropdownOpen.value = false;
});

const { listConfig, size, disabled, modelValue } = toRefs(props);
const dropdownOpen = ref(false);

const availableCurrencies = computed(
  () => listConfig.value.availableCurrencies || []
);

const { currencyConfig, filteredCurrencies } = useCurrency({
  code: computed(() => modelValue.value.currency),
  availableCurrencies,
});

const itemHeightComp = computed(
  () => listConfig.value.itemHeight || rowSizes[size.value || "lg"]
);

const listHeight = computed(
  () =>
    (listConfig.value.itemsPerView || DEFAULT_ITEMS_PER_VIEW) *
    itemHeightComp.value
);

const animationName = computed(() => listConfig.value.animationName || "fade");

const switchDropdown = (value?: boolean) => {
  if (listConfig?.value.openBlocked || filteredCurrencies.value.length <= 1)
    return;
  dropdownOpen.value = value != null ? value : !dropdownOpen.value;
};

const setVal = (event: Event) => {
  const newVal = (event.target as HTMLInputElement).value;

  emit("update:modelValue", {
    value: newVal,
    currency: modelValue.value.currency,
  });
};

const selectItem = (item: CurrencyConfig) => {
  switchDropdown(false);
  emit("update:modelValue", {
    value: modelValue.value.value,
    currency: item.code,
  });
};

onMounted(() => {
  if (
    filteredCurrencies.value?.length &&
    !filteredCurrencies.value.find((c) => c.code === modelValue.value.currency)
  ) {
    console.warn(
      `[vue-currency-converter]: Provided currency "${modelValue.value.currency}" is not in the availableCurrencies list. The first available currency will be used instead.`
    );
    emit("update:modelValue", {
      value: modelValue.value.value,
      currency: filteredCurrencies.value[0].code,
    });
  }
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/layout.scss" as *;

.currency-input {
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: var(--currency-input-bg, #fff);
  border: var(--currency-input-border, none);
  height: 100%;

  * {
    box-sizing: border-box;
  }

  &.reverse {
    flex-direction: row-reverse;
  }

  &.open {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;

    .curr-header__chevron {
      transform: rotate(180deg);
    }
  }

  input {
    background-color: var(--currency-input-field-bg, transparent);
    color: var(--currency-input-field-color, #000);
    outline: var(--currency-input-field-outline, none);
    border: var(--currency-input-field-border, none);
    font-size: var(--currency-input-field-font-size, 1rem);
    padding: var(--currency-input-padding, 0.5rem);
    border-right: var(--tel-input-border, none);
    width: var(--currency-input-field-width, 100%);

    &:disabled {
      cursor: not-allowed;
    }
  }

  .curr-selector {
    .curr-header {
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--currency-input-header-gap, 8px);
      padding: var(--currency-input-header-padding, 0 8px);
      cursor: pointer;

      .curr-code {
        color: var(--currency-input-code-color, #000);
        font-size: var(--currency-input-code-font-size, 1rem);
      }

      &__chevron {
        width: var(--tel-input-icon-size, 12px);
        height: var(--tel-input-icon-size, 12px);
        transition: var(--tel-input-chevron-transition-func, ease)
          var(--tel-input-transition-duration, 0.3s)
          var(--tel-input-chevron-transition-delay, 0s)
          var(--tel-input-chevron-transition-prop, transform);
      }
    }

    .curr-body {
      position: absolute;
      top: 100%;
      left: 0;
      overflow-y: auto;
      background-color: var(--currency-input-body-bg, #fff);
      width: 100%;
      border: var(--currency-input-body-border, none);
      box-shadow: var(
        --currency-input-body-shadow,
        0 2px 8px rgba(0, 0, 0, 0.15)
      );
      border-bottom-left-radius: var(--currency-input-border-radius, 6px);
      border-bottom-right-radius: var(--currency-input-border-radius, 6px);

      &::-webkit-scrollbar {
        width: var(--currency-input-scrollbar-width, 8px);
        background: var(--currency-input-scrollbar-bg, transparent);
        position: absolute;
      }
      &::-webkit-scrollbar-thumb {
        background: var(
          --currency-input-scrollbar-thumb-bg,
          rgba(0, 0, 0, 0.2)
        );
        border-radius: var(--currency-input-scrollbar-thumb-radius, 4px);
      }

      .item-row {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: var(--currency-input-item-gap, 8px);
        color: var(--currency-input-item-color, #000);
        border-bottom: var(--currency-input-item-border, 1px solid #ccc);
        padding: var(--currency-input-item-padding, 0 8px);
        cursor: pointer;
        transition: var(
          --currency-input-item-transition,
          background-color 0.2s ease
        );

        &:hover {
          background-color: var(--currency-input-item-hover-bg, #e6e6e6);
        }

        &.selected {
          background-color: var(--currency-input-item-selected-bg, #e0e0e0);
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
