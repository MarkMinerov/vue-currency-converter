<template>
  <div
    class="currency-input"
    ref="currencyInput"
    :class="{ open: dropdownOpen }"
  >
    <input type="text" />

    <div class="curr-selector">
      <div class="curr-header" @click="switchDropdown()">
        <span class="curr-code">{{ selectedCurrency }}</span>
        <svg class="curr-header__chevron" viewBox="0 0 16 16">
          <path
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>
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
            :class="{ selected: item.code === selectedCurrency }"
            @click="selectItem(item)"
          >
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
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, useTemplateRef } from "vue";
import { onClickOutside } from "~/composables/onClickOutside";
import { CurrencyCode, useCurrency } from "~/composables/useCurrency";
import { CurrencyConfig, ListParams, Size } from "~/types";

const DEFAULT_ITEMS_PER_VIEW = 5;

const props = withDefaults(
  defineProps<
    Partial<{
      initialCode: CurrencyCode;
      listConfig: ListParams;
      itemHeight: number;
      size: Size;
    }>
  >(),
  {
    initialCode: "USD",
    listConfig: () => ({
      itemsPerView: DEFAULT_ITEMS_PER_VIEW,
      item: {
        hideCode: false,
        hideName: false,
        hideSymbol: false,
      },
    }),
  }
);

const rowSizes = {
  sm: 32,
  md: 36,
  lg: 40,
  xl: 48,
  xxl: 56,
};

const currencyInput = useTemplateRef<HTMLElement>("currencyInput");

onClickOutside(currencyInput, () => {
  dropdownOpen.value = false;
});

const { initialCode, listConfig, size } = toRefs(props);

const selectedCurrency = ref<CurrencyCode>(initialCode.value);
const dropdownOpen = ref(false);

const availableCurrencies = computed(
  () => listConfig.value.availableCurrencies || []
);

const { currencyConfig, filteredCurrencies } = useCurrency({
  code: selectedCurrency,
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
  dropdownOpen.value = value != null ? value : !dropdownOpen.value;
};

const selectItem = (item: CurrencyConfig) => {
  selectedCurrency.value = item.code as CurrencyCode;
  switchDropdown(false);
};
</script>

<style lang="scss" scoped>
.currency-input {
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: var(--currency-input-bg, #fff);
  border: var(--currency-input-border, 1px solid #ccc);
  height: 100%;

  * {
    box-sizing: border-box;
  }

  &.open {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  input {
    background-color: var(--currency-input-field-bg, transparent);
    color: var(--currency-input-field-color, #000);
    outline: var(--currency-input-field-outline, none);
    border: var(--currency-input-field-border, none);
    font-size: var(--currency-input-field-font-size, 1rem);
    padding: var(--currency-input-padding, 0.5rem);
    border-right: var(--tel-input-border, 1px solid #ccc);
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
      border: var(--currency-input-body-border, 1px solid #ccc);
      box-shadow: var(
        --currency-input-body-shadow,
        0 2px 8px rgba(0, 0, 0, 0.15)
      );
      border-bottom-left-radius: var(--currency-input-border-radius, 6px);
      border-bottom-right-radius: var(--currency-input-border-radius, 6px);

      &::-webkit-scrollbar {
        width: 8px;
        background: transparent;
        position: absolute;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
