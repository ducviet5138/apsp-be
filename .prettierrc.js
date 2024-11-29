module.exports = {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: false,
  bracketSameLine: true,
  trailingComma: "es5",
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderParserPlugins: ["typescript", "classProperties", "decorators-legacy"],
  plugins: ["@trivago/prettier-plugin-sort-imports"]
};
