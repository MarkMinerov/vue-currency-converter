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
  availableCurrencies: Ref<CurrencyCode[]>;
}) => {
  const currencyConfig = computed(() => currencies[code.value]);

  const filteredCurrencies = computed(() => {
    if (availableCurrencies.value.length) {
      return availableCurrencies.value
        .filter((code) => {
          if (!keys.includes(code)) {
            console.warn(
              `[vue-currency-converter] The currency code "${code}" is not supported. Please open an issue on GitHub: https://github.com/MarkMinerov/vue-currency-converter/issues if you need support for this currency.`
            );
            return false;
          }

          return true;
        })
        .map((code) => currencies[code]);
    }

    return values;
  });

  return { currencyConfig, filteredCurrencies };
};
