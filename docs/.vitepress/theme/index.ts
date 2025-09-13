import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import googleAnalytics from "vitepress-plugin-google-analytics";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {});
  },
  enhanceApp() {
    googleAnalytics({
      id: "G-FXX739P51K",
    });
  },
} satisfies Theme;
