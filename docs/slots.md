# Slots

| Slot             | Scope | Description                                                              |
| ---------------- | ----- | ------------------------------------------------------------------------ |
| `header:before`  | –     | Content rendered **before** the currency code in the header (e.g. icon). |
| `header:after`   | –     | Content rendered **after** the currency code in the header (e.g. icon).  |
| `header:chevron` | –     | Replaces the default chevron (dropdown indicator).                       |
| `item:before`    | –     | Content rendered **before** each item in the dropdown list.              |
| `item:after`     | –     | Content rendered **after** each item in the dropdown list.               |

<h3>Example</h3>

```vue
<CurrencyInput v-model="model">
  <template #header:before>
    <span>💰</span>
  </template>
</CurrencyInput>
```
