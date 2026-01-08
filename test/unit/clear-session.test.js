import { jest } from '@jest/globals'
import route from '../../app/routes/clear-session.js'

describe('clear-session route', () => {
  test('clears claim session and redirects', () => {
    const request = { yar: { clear: jest.fn() } }
    const h = { redirect: jest.fn(() => 'redirect') }

    const result = route.options.handler(request, h)

    expect(request.yar.clear).toHaveBeenCalledWith('claim')
    expect(h.redirect).toHaveBeenCalledWith('/')
    expect(result).toBe('redirect')
  })
})
