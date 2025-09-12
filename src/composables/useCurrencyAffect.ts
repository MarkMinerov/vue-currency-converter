import { type ComputedRef, type Ref, watch, computed } from "vue";
import type { ApiData, CurrencyConfig } from "~/types";
import { CurrencyCode } from "./useCurrency";

import currencyJson from "~/configs/currency.json";
const currenciesConfig = currencyJson as Record<string, CurrencyConfig>;

export function useCurrencyAffect({
  data,
  affectedModel,
  currencies,
  modelValue,
}: {
  data: Ref<ApiData>;
  affectedModel: Ref<string>;
  currencies: ComputedRef<{ from: CurrencyCode; to: CurrencyCode }>;
  modelValue: ComputedRef<string>;
}) {
  const convert = () => {
    const value = parseFloat(modelValue.value);

    if (!isNaN(value) && value != null) {
      const from = currencies.value.from;
      const to = currencies.value.to;
      if (!from || !to) return;

      const decimal_digits = currenciesConfig[from]?.decimal_digits || 2;
      const conversionRate = data.value?.[from]?.[to];

      if (conversionRate) {
        const val = value * conversionRate;
        affectedModel.value = val.toFixed(decimal_digits);
        return;
      } else {
        console.warn(
          `No conversion rate found from ${from} to ${to} found in API data.`
        );
      }
    }

    affectedModel.value = "";
  };

  watch(() => modelValue.value, convert);

  const unknown = computed(
    () => !data.value?.[currencies.value.from]?.[currencies.value.to]
  );

  return { unknown, convert };
}
