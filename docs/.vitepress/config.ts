import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vue Currency Converter",
  description: "Vue 3 component to convert currencies",
  base: "/vue-currency-converter/",
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "Examples", link: "/examples" },
    ],

    sidebar: [
      {
        text: "Introduction",
        collapsed: false,
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Examples", link: "/examples" },
        ],
      },
      {
        text: "Usage",
        collapsed: false,
        items: [
          { text: "Props", link: "/props" },
          { text: "Events", link: "/events" },
          { text: "Slots", link: "/slots" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/MarkMinerov/vue-tel-num-input",
      },
    ],
  },
});
