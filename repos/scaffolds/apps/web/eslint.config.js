//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

/** @type {any} */
const config = [{ ignores: [".output/**", ".tanstack/**"] }, ...tanstackConfig]

export default config
