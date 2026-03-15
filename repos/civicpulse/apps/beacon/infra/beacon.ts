/// <reference path="../../../../../.sst/platform/config.d.ts" />

export const beacon = (() => {
  // Stage-specific environment configurations
  const getEnvironmentConfig = (stage: string) => {
    const baseConfig = {
      NEXT_PUBLIC_APP_STAGE: stage,
      NEXT_PUBLIC_APP_NAME: 'Civic Pulse: Alpha Mode',
      NEXT_PUBLIC_APP_VERSION: '0.0.1',
      AWS_S3_REGION: 'ap-southeast-1',
    }

    switch (stage) {
      case 'production':
        return {
          ...baseConfig,
          NEXT_PUBLIC_APP_URL: 'https://civicpulse.montz.qzz.io',
          DATABASE_URL: process.env.PROD_DATABASE_URL || '',
          AWS_S3_BUCKET_NAME: process.env.PROD_S3_BUCKET || '',
          NEXT_PUBLIC_CDN_URL: process.env.PROD_CDN_URL || '',
          LOG_LEVEL: 'warn',
          RATE_LIMIT_REQUESTS_PER_MINUTE: '60',
          NEXT_PUBLIC_ENABLE_BETA_FEATURES: 'false',
        }

      default: // dev and other stages
        return {
          ...baseConfig,
          NEXT_PUBLIC_APP_URL: `https://civicpulse-${stage}.montz.qzz.io`,
          DATABASE_URL: process.env.DEV_DATABASE_URL || '',
          LOG_LEVEL: 'debug',
          RATE_LIMIT_REQUESTS_PER_MINUTE: '200',
          NEXT_PUBLIC_ENABLE_BETA_FEATURES: 'true',
        }
    }
  }

  // Create the NextJS site with stage-based configuration
  return new sst.aws.Nextjs('CivicPulseAlpha', {
    path: 'repos/civicpulse/apps/beacon',
    domain: {
      name: `civicpulse-${$app.stage}.montz.qzz.io`,
      dns: sst.cloudflare.dns(),
    },

    // Stage-specific environment variables
    environment: getEnvironmentConfig($app.stage),

    // Performance optimizations
    imageOptimization: {
      memory: $app.stage === 'production' ? '1024 MB' : '512 MB',
    },

    // Build configuration - use Nx to trigger open-next
    buildCommand: 'mise exec -- pnpm nx run @civicpulse/beacon:build:opennext',
  })
})()
