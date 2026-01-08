import { jest } from '@jest/globals'

const buildRoutes = async () => {
  jest.resetModules()
  const updatePolicyMock = jest.fn()

  jest.unstable_mockModule('../../app/cookies/index.js', () => ({
    updatePolicy: updatePolicyMock
  }))

  const { default: routes } = await import('../../app/routes/cookies/cookies.js')
  return { routes, updatePolicyMock }
}

describe('cookies routes', () => {
  test('GET /cookies renders the policy view', async () => {
    const { routes } = await buildRoutes()
    const route = routes.find((item) => item.method === 'GET')
    const h = { view: jest.fn(() => 'view') }
    const request = {
      state: { cookies_policy: { analytics: true } },
      query: { updated: 'true' }
    }

    const result = route.handler(request, h)

    expect(h.view).toHaveBeenCalledWith('cookies/cookie-policy', undefined)
    expect(result).toBe('view')
  })

  test('POST /cookies returns ok when async', async () => {
    const { routes, updatePolicyMock } = await buildRoutes()
    const route = routes.find((item) => item.method === 'POST')
    const h = { response: jest.fn(() => 'ok'), redirect: jest.fn() }
    const request = { payload: { analytics: true, async: true } }

    const result = route.options.handler(request, h)

    expect(updatePolicyMock).toHaveBeenCalledWith(request, h, true)
    expect(h.response).toHaveBeenCalledWith('ok')
    expect(result).toBe('ok')
    expect(h.redirect).not.toHaveBeenCalled()
  })

  test('POST /cookies redirects when not async', async () => {
    const { routes, updatePolicyMock } = await buildRoutes()
    const route = routes.find((item) => item.method === 'POST')
    const h = { response: jest.fn(), redirect: jest.fn(() => 'redirect') }
    const request = { payload: { analytics: false, async: false } }

    const result = route.options.handler(request, h)

    expect(updatePolicyMock).toHaveBeenCalledWith(request, h, false)
    expect(h.redirect).toHaveBeenCalledWith('/cookies?updated=true')
    expect(result).toBe('redirect')
  })
})
