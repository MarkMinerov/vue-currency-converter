# ⭐ Examples

Some examples to help a developer understand how to work with this component.

1. **Minimal usage**

```vue
<script setup>
import { ref } from "vue";
import CurrencyConverter from "vue-currency-converter";
import "vue-currency-converter/style.css";

const model = ref();
</script>

<template>
  <CurrencyConverter v-model="model" />
</template>
```

`v-model` returns a typed object (`Model`), not a plain string.
Initialize with `{}` (component will populate it).

2. **Custom default currencies**

```vue
<script setup lang="ts">
import { ref } from "vue";
import CurrencyConverter from "vue-currency-converter";

const model = ref({
  currencies: ["GBP", "JPY"],
  values: ["100", ""],
});
</script>

<template>
  <CurrencyConverter v-model="model" />
</template>
```

3. **With slots (custom UI parts)**

```vue
<template>
  <CurrencyConverter v-model="model">
    <template #header:before>🌍</template>
    <template #header:after>💱</template>
    <template #item:before>👉</template>
    <template #item:after>✔</template>
  </CurrencyConverter>
</template>
```

4. **Custom API integration**

```vue
<template>
  <CurrencyConverter
    v-model="model"
    :api="{
      url: {
        base: 'XXXXXX',
        builder: (url, code) => `${url}?base=${code}`,
      },
      setter: (response, mutable) => {
        if (response.base && response.rates) {
          mutable.value[response.base] = response.rates;
        }
      },
    }"
  />
</template>
```

5. **Events handling**

```vue
<template>
  <CurrencyConverter
    v-model="model"
    @setCurrencies="(curr) => console.log('Currencies changed:', curr)"
    @request:success="(data) => console.log('Rates loaded:', data)"
    @request:error="(err) => console.error('API error:', err)"
  />
</template>
```

6. **Custom list configuration**

```vue
<template>
  <CurrencyConverter
    v-model="model"
    :listConfig="{
      from: { reverse: true },
      to: { item: { hideSymbol: true } },
    }"
  />
</template>
```
