/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PluginConfig} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    // Must come last. https://dev.to/kachidk/common-prettier-plugins-installation-30hc
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [],
  importOrderSortSpecifiers: true,
};

export default config;
