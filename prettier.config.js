/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    /**
     * Must come last
     * https://dev.to/kachidk/common-prettier-plugins-installation-30hc
     */
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
