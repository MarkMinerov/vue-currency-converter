import { ref, Ref } from "vue";
import { ApiConfig, ApiData } from "~/types";
import { CurrencyCode } from "./useCurrency";

export const useApi = (api: Ref<Partial<ApiConfig>>) => {
  const data = ref<ApiData>({});
  const cache = ref<Record<string, number>>({});

  const fetchData = async (code?: CurrencyCode) => {
    if (!api.value.disabled && api.value.url && api.value.setter) {
      const url = api.value.url.builder(api.value.url.base, code);
      const response = await fetch(url, api.value.fetchOptions);
      const json = await response.json();

      if (response.ok) api.value.setter(json, data);
      else return Promise.reject(json);
    }

    return Promise.resolve(data.value);
  };

  const getRates = async (code: CurrencyCode) => {
    if (!code)
      return console.warn("[vue-currency-converter] No currency code provided");

    if (cache.value[code]) {
      const lastCacheTime = cache.value[code];
      if (api.value.cache && Date.now() - lastCacheTime < api.value.cache)
        return Promise.resolve(data.value);
    }

    if (api.value.cache) cache.value[code] = Date.now();
    return await fetchData(code);
  };

  return { data, getRates };
};
