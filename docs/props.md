# Props

`<VueCurrencyConverter>` accepts a large set of props to control behavior, appearance, and data sources.
All props are optional — sensible defaults are provided.

| Prop         | Type                  | Default   | Description                                                                                                                             |
| ------------ | --------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `Model`               | — (req)   | Bound value for `v-model`. Holds the current state of the currency input.                                                               |
| `listConfig` | `Partial<ListParams>` | see below | Configuration for the currency list / behavior. Any subset of `ListParams`. Unspecified fields fall back to component defaults (below). |
| `itemHeight` | `number`              | —         | Fixed pixel height for each item row (overrides CSS var–driven sizing if provided).                                                     |
| `size`       | `Size`                | —         | Component size token used by your design system (e.g., `sm`, `md`, …). Controls overall spacing/row heights via CSS vars.               |
| `disabled`   | `boolean`             | `false`   | Disables user interaction with the input and list.                                                                                      |

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
