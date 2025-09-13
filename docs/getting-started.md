# 🚀 Getting Started

Welcome to **Vue Currency Converter** - Vue 3.x component for currency conversion with customizable styles and configurable API endpoints for data fetching.

## 📦 Installation

```bash
npm i vue-currency-converter
# or
npm i vue-currency-converter
# or
pnpm i vue-currency-converter
```

Then import component and minimal styles in your `.vue` file:

```ts
import CurrencyConverter from "vue-currency-converter";
import "vue-currency-converter/style.css";
```

## ⚡ Quick Start

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

That’s it 🎉 You now have a fully functional currency conversion component.

## 🧾 Why this component?

- **Flexible by default** – simple setup, full customization with slots, props, and styles
- **Composability** – integrate your own API, formatting logic, or currency lists
- **DX-first** – typed model, reactive v-model support, clear events & slots
- **Performance-aware** – lightweight core, minimal dependencies, fast updates

## 🔗 Next Steps

- [**Examples**](/examples) – usage and customization examples
- [**Props**](/props) – full list of props and configuration options
- [**Events**](/events) – emitted events and integration details
- [**Slots**](/slots) – customize every part of the UI
