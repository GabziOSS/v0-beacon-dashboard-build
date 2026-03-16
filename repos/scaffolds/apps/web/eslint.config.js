//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

/** @type {any} */
const config = [
  { ignores: [".output/**", ".tanstack/**", "sst-env.d.ts"] },
  ...tanstackConfig,
]

export default config
