# 🎯 Events

`<VueCurrencyConverter />` component emits a small, well-typed set of events for model sync, currency selection, and API lifecycle.

## Overview

```ts
const emit = defineEmits<{
  (e: "setCurrencies", value: [CurrencyCode, CurrencyCode]): void;
  (e: "update:modelValue", value: Model): void;
  (e: "request:error", error: unknown): void;
  (e: "request:success", data: ApiData): void;
}>();
```

## Event Reference

| Event               | Payload type                   | When it fires                                                                                 | Notes                                                        |
| ------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `setCurrencies`     | `[CurrencyCode, CurrencyCode]` | When either side’s selected currency changes (`leftModel.currency` or `rightModel.currency`). | Use to persist user preference or sync with URL/query/state. |
| `update:modelValue` | `Model`                        | On any change to internal state: values, currencies, or loading flag.                         | v-model compatibility. Treat as the single source of truth.  |
| `request:success`   | `ApiData`                      | After exchange rates are successfully fetched and written to internal cache.                  | Useful for logging, caching, or telemetry.                   |
| `request:error`     | `unknown`                      | When fetching exchange rates fails for any reason (network, 4xx/5xx, parsing).                | Handle gracefully; don’t assume `Error` shape.               |

> Types: `CurrencyCode`, `Model`, and `ApiData` are exported by the library. If you use your own API, conform to `ApiData` or map it via the `api.setter`.

## Usage Examples

```vue
<script setup lang="ts">
import { ref } from "vue";
import CurrencyConverter, {
  type Model,
  type ApiData,
} from "vue-currency-converter";

const model = ref<Model>({
  currencies: ["USD", "EUR"],
  values: ["", ""],
  loading: false,
});

function onSetCurrencies([from, to]: [string, string]) {
  console.log("Currencies changed:", from, "→", to);
}

function onSuccess(data: ApiData) {
  console.log("Rates loaded:", Object.keys(data));
}

function onError(err: unknown) {
  // Don’t assume Error shape
  console.error("Rates fetch failed:", err);
}
</script>

<template>
  <CurrencyConverter
    v-model="model"
    @setCurrencies="onSetCurrencies"
    @request:success="onSuccess"
    @request:error="onError"
  />
</template>
```

### Watch the v-model and react

```js
import { watch } from "vue";

watch(
  model,
  (next) => {
    // Example: reflect state into URL or analytics
    // next.currencies -> ['USD','EUR']
    // next.values     -> ['123.45','113.21']
    // next.loading    -> boolean
  },
  { deep: true }
);
```

---

## TypeScript Tips

```vue
<CurrencyConverter
  v-model="model"
  @setCurrencies="([from, to]: [CurrencyCode, CurrencyCode]) => {
    // your logic
  }"
  @request:success="(data: ApiData) => { /* ... */ }"
  @request:error="(err: unknown) => { /* ... */ }"
/>
```

## Narrowing `request:error`

```js
function onError(err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  } else if (typeof err === "string") {
    console.error(err);
  } else {
    console.error("Unknown error:", err);
  }
}
```

## Common Patterns

- **Sync currency selection to app state**: use `@setCurrencies` to store `[from, to]` in your global store or URL query.
- **Client-side cache or metrics**: use `@request:success` to persist `ApiData` to your cache layer (e.g., `localStorage`, `Pinia`) or send telemetry.
- **Graceful fallbacks**: on `@request:error`, you can:
  - show a toast/banner
  - back off to last known rates
  - disable conversions (set a flag in your parent)
