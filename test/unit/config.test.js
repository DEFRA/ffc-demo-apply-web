import { jest } from '@jest/globals'

const ORIGINAL_ENV = { ...process.env }

describe('config', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    jest.restoreAllMocks()
  })

  test('builds config for test environment without redis', async () => {
    process.env.NODE_ENV = 'test'
    delete process.env.REDIS_HOSTNAME
    process.env.COOKIE_PASSWORD = 'cookiecookiecookiecookiecookiecookie'

    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.resetModules()

    const { default: config } = await import('../../app/config/index.js')

    expect(config.isTest).toBe(true)
    expect(config.isDev).toBe(true)
    expect(config.isProd).toBe(false)
    expect(config.useRedis).toBe(false)
    expect(infoSpy).toHaveBeenCalledWith('Redis disabled, using in memory cache')
  })

  test('builds config for production with redis', async () => {
    process.env.NODE_ENV = 'production'
    process.env.REDIS_HOSTNAME = 'redis'
    process.env.REDIS_PORT = '1234'
    process.env.COOKIE_PASSWORD = 'cookiecookiecookiecookiecookiecookie'

    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.resetModules()

    const { default: config } = await import('../../app/config/index.js')

    expect(config.isProd).toBe(true)
    expect(config.useRedis).toBe(true)
    expect(config.catboxOptions.tls).toEqual({})
    expect(config.cookieOptions.isSecure).toBe(true)
    expect(infoSpy).not.toHaveBeenCalled()
  })
})
