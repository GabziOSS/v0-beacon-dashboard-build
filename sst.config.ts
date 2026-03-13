/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'civic-pulse-alpha',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: {
          region: 'ap-southeast-1',
        },
        cloudflare: true,
      },
    }
  },
  async run() {
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

        // case 'staging':
        //   return {
        //     ...baseConfig,
        //     NEXT_PUBLIC_APP_URL: 'https://civicpulse-staging.montz.qzz.io',
        //     LOG_LEVEL: 'info',
        //     RATE_LIMIT_REQUESTS_PER_MINUTE: '100',
        //     NEXT_PUBLIC_ENABLE_BETA_FEATURES: 'true',
        //   }

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
    const site = new sst.aws.Nextjs('CivicPulseAlpha', {
      domain: {
        name: `civicpulse-${$app.stage}.montz.qzz.io`,
        dns: sst.cloudflare.dns(),
      },
      // domain:
      //   $app.stage === 'production'
      //     ? {
      //         name: 'montz.qzz.io',
      //         redirects: ['www.montz.qzz.io'],
      //         dns: sst.cloudflare.dns(),
      //       }
      //     : {
      //         name: `${$app.stage}.montz.qzz.io`,
      //         dns: sst.cloudflare.dns(),
      //       },

      // Stage-specific environment variables
      environment: getEnvironmentConfig($app.stage),

      // Performance optimizations
      imageOptimization: {
        memory: $app.stage === 'production' ? '1024 MB' : '512 MB',
      },

      // Build configuration - use OpenNext for SST deployment
      buildCommand: 'pnpm run build:opennext',
    })

    return {
      url: site.url,
      stage: $app.stage,
    }
  },
})
