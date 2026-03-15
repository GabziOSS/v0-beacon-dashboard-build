import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  resolveAlias: {
    "@": resolve(__dirname, "."),
  },
  transpilePackages: [
    "@beacon/ui",
    "@beacon/chart-kit",
    "@beacon/weather-charts",
    "@beacon/dashboard",
    "@civicpulse/data",
    "@civicpulse/hooks",
    "@civicpulse/types",
  ],
}

export default nextConfig
