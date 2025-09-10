import { computed, Ref } from "vue";

import currencyJson from "~/configs/currency.json";
import { type CurrencyConfig } from "~/types";

const currencies = currencyJson as Record<string, CurrencyConfig>;
export type CurrencyCode = keyof typeof currencyJson;
const keys = Object.keys(currencies) as CurrencyCode[];
const values = Object.values(currencies);

export const useCurrency = ({
  code,
  availableCurrencies,
}: {
  code: Ref<CurrencyCode>;
  availableCurrencies: Ref<CurrencyCode[]> | null;
}) => {
  const currencyConfig = computed(() => currencies[code.value]);

  const filteredCurrencies = computed(() => {
    if (availableCurrencies?.value && availableCurrencies.value.length) {
      return availableCurrencies.value
        .filter((code) => keys.includes(code))
        .map((code) => currencies[code]);
    }

    return values;
  });

  return { currencyConfig, filteredCurrencies };
};
