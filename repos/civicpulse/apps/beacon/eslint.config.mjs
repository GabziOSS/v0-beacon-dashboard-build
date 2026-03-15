import nextEslintPluginNext from "@next/eslint-plugin-next"
import nx from "@nx/eslint-plugin"
import baseConfig from "../../../../eslint.config.mjs"

export default [
  { plugins: { "@next/next": nextEslintPluginNext } },
  ...baseConfig,
  ...nx.configs["flat/react-typescript"],
  {
    ignores: [".next/**/*", ".output/**/*", "node_modules/**/*", "infra/**/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]
