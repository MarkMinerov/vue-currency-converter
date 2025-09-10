import { ShallowRef, watch, Ref, ComputedRef } from "vue";
import type { CurrencyInputInstance } from "~/components/CurrencyConverter.vue";

export function useCurrencyAffect({
  inputElement,
  affectedModel,
  useFormat,
}: {
  inputElement: ShallowRef<HTMLInputElement>;
  affectedModel: Ref<string>;
  useFormat: ComputedRef<boolean>;
}) {
  watch(
    inputElement,
    (el, _, onCleanup) => {
      if (!el) return;

      const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        // affectedModel.value = (parseInt(value) * 2).toString();
      };

      el.addEventListener("input", handleInput);

      onCleanup(() => {
        el?.removeEventListener("input", handleInput);
      });
    },
    { immediate: true }
  );
}
