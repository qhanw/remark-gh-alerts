import antfu from "@antfu/eslint-config";

export default antfu(
  {
    ignores: [
      // eslint ignore globs here
    ],
  },
  {
    rules: {
      // overrides
      // "antfu/curly": ["off"],
      "style/semi": ["off"],
      "style/quotes": ["off"],
      "perfectionist/sort-imports": ["off"], // 完全关闭
    },
  },
);
