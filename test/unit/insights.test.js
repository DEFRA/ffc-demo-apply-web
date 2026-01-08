import { jest } from '@jest/globals'

const ORIGINAL_ENV = { ...process.env }

const buildSetup = async () => {
  jest.resetModules()
  const startMock = jest.fn()
  const setupMock = jest.fn(() => ({ start: startMock }))
  const addTelemetryProcessorMock = jest.fn()
  const defaultClient = {
    context: {
      keys: { cloudRole: 'cloudRoleKey' },
      tags: {}
    },
    addTelemetryProcessor: addTelemetryProcessorMock
  }
  const appInsightsMock = { setup: setupMock, defaultClient }

  jest.unstable_mockModule('applicationinsights', () => ({
    default: appInsightsMock
  }))

  const { setup } = await import('../../app/insights.js')
  return {
    setup,
    setupMock,
    startMock,
    addTelemetryProcessorMock,
    defaultClient
  }
}

describe('app insights setup', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    jest.restoreAllMocks()
  })

  test('starts app insights and configures cloud role + telemetry processor', async () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-conn'
    process.env.APPINSIGHTS_CLOUDROLE = 'demo-web'
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const {
      setup,
      setupMock,
      startMock,
      addTelemetryProcessorMock,
      defaultClient
    } = await buildSetup()

    setup()

    expect(setupMock).toHaveBeenCalledWith('test-conn')
    expect(startMock).toHaveBeenCalled()
    expect(defaultClient.context.tags.cloudRoleKey).toEqual('demo-web')
    expect(addTelemetryProcessorMock).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('App Insights running')

    const processor = addTelemetryProcessorMock.mock.calls[0][0]
    expect(processor({ data: { baseData: { url: 'http://test/healthz' } } })).toBe(false)
    expect(processor({ data: { baseData: { url: 'http://test/claim' } } })).toBe(true)
    expect(processor({ data: { baseData: {} } })).toBe(true)
  })

  test('logs when app insights is disabled', async () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const { setup, setupMock } = await buildSetup()

    setup()

    expect(setupMock).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('App Insights not running')
  })
})
