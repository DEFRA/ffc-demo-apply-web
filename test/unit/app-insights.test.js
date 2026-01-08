import { jest } from '@jest/globals'

const ORIGINAL_ENV = { ...process.env }

const buildSetup = async () => {
  jest.resetModules()
  const startMock = jest.fn()
  const setupMock = jest.fn(() => ({ start: startMock }))
  const defaultClient = {
    context: {
      keys: { cloudRole: 'cloudRoleKey' },
      tags: {}
    }
  }
  const appInsightsMock = { setup: setupMock, defaultClient }

  jest.unstable_mockModule('applicationinsights', () => ({
    default: appInsightsMock
  }))

  const { default: appInsightsService } = await import('../../app/services/app-insights.js')
  return { appInsightsService, setupMock, startMock, defaultClient }
}

describe('app insights service setup', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    jest.restoreAllMocks()
  })

  test('starts app insights and sets cloud role', async () => {
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY = 'test-key'
    process.env.APPINSIGHTS_CLOUDROLE = 'demo-web'
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const { appInsightsService, setupMock, startMock, defaultClient } = await buildSetup()

    appInsightsService.setup()

    expect(setupMock).toHaveBeenCalled()
    expect(startMock).toHaveBeenCalled()
    expect(defaultClient.context.tags.cloudRoleKey).toEqual('demo-web')
    expect(logSpy).toHaveBeenCalledWith('App Insights Running')
  })

  test('logs when app insights is disabled', async () => {
    delete process.env.APPINSIGHTS_INSTRUMENTATIONKEY
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const { appInsightsService, setupMock } = await buildSetup()

    appInsightsService.setup()

    expect(setupMock).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('App Insights Not Running!')
  })
})
