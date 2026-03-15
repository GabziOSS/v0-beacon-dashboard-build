// eslint-disable-next-line @typescript-eslint/triple-slash-reference
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
    // Dynamically import the separated infra parts
    const { beacon } = await import('./repos/civicpulse/apps/beacon/infra/beacon')

    return {
      url: beacon.url,
      stage: $app.stage,
    }
  },
})
