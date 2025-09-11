import { ShallowRef, watch, Ref, ComputedRef } from "vue";
import { ApiData } from "~/types";
import { CurrencyCode } from "./useCurrency";

export function useCurrencyAffect({
  data,
  inputElement,
  affectedModel,
  useFormat,
  currencies,
}: {
  data: Ref<ApiData>;
  inputElement: ShallowRef<HTMLInputElement>;
  affectedModel: Ref<string>;
  useFormat: ComputedRef<boolean>;
  currencies: ComputedRef<{ from: CurrencyCode; to: CurrencyCode }>;
}) {
  watch(
    inputElement,
    (el, _, onCleanup) => {
      if (!el) return;

      const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);

        if (!isNaN(value) && value != null) {
          const from = currencies.value.from;
          const to = currencies.value.to;
          if (!from || !to) return;

          const conversionRate = data.value?.[from]?.[to] || 1;
          affectedModel.value = (value * conversionRate).toString();
        } else {
          affectedModel.value = "";
        }
      };

      el.addEventListener("input", handleInput);

      onCleanup(() => {
        el?.removeEventListener("input", handleInput);
      });
    },
    { immediate: true }
  );
}
