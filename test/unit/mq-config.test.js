import { jest } from '@jest/globals'

const ORIGINAL_ENV = { ...process.env }

describe('mq config', () => {
  const DEFAULT_ENV = process.env
  let useAzureMonitor

  afterAll(() => {
    process.env = DEFAULT_ENV
  })

  test('builds apply queue config for production', async () => {
    process.env.NODE_ENV = 'production'
    process.env.MESSAGE_QUEUE_HOST = 'host'
    process.env.MESSAGE_QUEUE_USER = 'user'
    process.env.MESSAGE_QUEUE_PASSWORD = 'pass'
    process.env.AZURE_CLIENT_ID = 'client-id'
    process.env.APPLY_QUEUE_ADDRESS = 'apply-queue'

    jest.resetModules()

    const { default: applyQueueConfig } = await import('../../app/config/mq-config.js')

    expect(applyQueueConfig).toMatchObject({
      host: 'host',
      useCredentialChain: true,
      type: 'queue',
      username: 'user',
      password: 'pass',
      managedIdentityClientId: 'client-id',
      useEmulator: false,
      address: 'apply-queue'
    })
  })

  test('builds apply queue config for non-production', async () => {
    process.env.NODE_ENV = 'development'
    process.env.MESSAGE_QUEUE_HOST = 'host'
    process.env.APPLY_QUEUE_ADDRESS = 'apply-queue'

    jest.resetModules()

    const { default: applyQueueConfig } = await import('../../app/config/mq-config.js')

    expect(applyQueueConfig).toMatchObject({
      host: 'host',
      useCredentialChain: false,
      type: 'queue',
      useEmulator: true,
      address: 'apply-queue'
    })
  })
})
