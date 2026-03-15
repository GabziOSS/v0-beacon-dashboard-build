import { tanstackConfig } from "@tanstack/eslint-config"
import type { Linter } from "eslint"

const config: Array<Linter.Config> = [
  ...tanstackConfig,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.lint.json",
      },
    },
  },
]

export default config
