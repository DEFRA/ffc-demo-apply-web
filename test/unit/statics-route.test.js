import { jest } from '@jest/globals'

const ORIGINAL_ENV = { ...process.env }

describe('static routes', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    jest.restoreAllMocks()
  })

  test('assets route uses configured cache timeout', async () => {
    process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS = '900000'
    jest.resetModules()

    const { routeAssets } = await import('../../app/routes/statics.js')

    expect(routeAssets.options.cache.expiresIn).toEqual('900000')
    expect(routeAssets.options.handler.directory.path).toContain(
      'node_modules/govuk-frontend/govuk/assets'
    )
  })

  test('statics route uses configured cache timeout', async () => {
    process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS = '900000'
    jest.resetModules()

    const { routeStatics } = await import('../../app/routes/statics.js')

    expect(routeStatics.options.cache.expiresIn).toEqual('900000')
    expect(routeStatics.options.handler.directory.path).toContain('app/dist')
  })
})
