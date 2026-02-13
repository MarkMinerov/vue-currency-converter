# Props

`<VueCurrencyConverter>` accepts a large set of props to control behavior, appearance, and data sources.
All props are optional — sensible defaults are provided.

| Prop         | Type                  | Default   | Description                                                                                                                                           |
| ------------ | --------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `Model`               | — (req)   | Bound value for `v-model`. Holds the current state of the currency input.                                                                             |
| `listConfig` | `Partial<ListParams>` | see below | Configuration for the currency list / behavior. Any subset of `ListParams`. Unspecified fields fall back to component defaults (below).               |
| `api`        | `Partial<ApiConfig>`  | see below | Configuration for the exchange-rates API (base URL, caching, fetch options, and response mapping). Omitted fields fall back to the built‑in defaults. |
| `itemHeight` | `number`              | —         | Fixed pixel height for each item row (overrides CSS var–driven sizing if provided).                                                                   |
| `size`       | `Size`                | —         | Component size token used by your design system (e.g., `sm`, `md`, …). Controls overall spacing/row heights via CSS vars.                             |
| `disabled`   | `boolean`             | `false`   | Disables user interaction with the input and list.                                                                                                    |

### `listConfig`

| Key                   | Type             | Default                  | Description                                                       |
| --------------------- | ---------------- | ------------------------ | ----------------------------------------------------------------- |
| `itemsPerView`        | `number`         | `DEFAULT_ITEMS_PER_VIEW` | How many items are visible in the scroll viewport.                |
| `itemHeight`          | `number`         | —                        | Per-item row height (px). If omitted, size/CSS vars are used.     |
| `availableCurrencies` | `CurrencyCode[]` | —                        | Optional allowlist of currencies to display.                      |
| `animationName`       | `string`         | —                        | Custom CSS animation name for list transitions.                   |
| `reverse`             | `boolean`        | `false`                  | Reverses list order.                                              |
| `needFormat`          | `boolean`        | `true`                   | Whether to live-format typed values (e.g., thousands separators). |
| `openBlocked`         | `boolean`        | `false`                  | If `true`, prevents opening the dropdown/list.                    |
| `item.hideCode`       | `boolean`        | `false`                  | Hide the currency code (e.g., `USD`).                             |
| `item.hideName`       | `boolean`        | `false`                  | Hide the currency name (e.g., “US Dollar”).                       |
| `item.hideSymbol`     | `boolean`        | `false`                  | Hide the currency symbol (e.g., `$`).                             |

### `api`

The `api` prop lets you customize how exchange rates are fetched.
It accepts any subset of `ApiConfig`; omitted fields use the defaults.

| Key               | Type                                                                         | Default                               | Description                                                      |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| `cache`           | `number`                                                                     | `60 * 60 * 1000` (1 hour)             | Cache duration for fetched rates in milliseconds.                |
| `fetchOptions`    | `RequestInit`                                                                | `{}`                                  | Extra options passed to `fetch` (headers, credentials, etc.).    |
| `disabled`        | `boolean`                                                                    | `false`                               | If `true`, disables automatic API requests.                      |
| `url.base`        | `string`                                                                     | `"https://open.er-api.com/v6/latest"` | Base URL used for loading exchange rates.                        |
| `url.builder`     | `(url: string, code?: CurrencyCode)`                                         | `(url, code) => \                     |
| `${url}/${code}`` | Function to build the final request URL from the base URL and currency code. |
| `setter`          | `(response: any, mutable: Ref<ApiData>) => void`                             | built‑in mapper for the default API   | Maps the raw API response into the internal `ApiData` structure. |
