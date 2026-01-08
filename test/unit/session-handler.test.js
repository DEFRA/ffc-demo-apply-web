import { jest } from '@jest/globals'
import SessionHandler from '../../app/services/session-handler.js'

describe('session handler', () => {
  test('get returns stored value', () => {
    const request = {
      yar: {
        get: jest.fn(() => ({ name: 'demo' }))
      }
    }
    const handler = new SessionHandler()

    const result = handler.get(request, 'claim')

    expect(result).toEqual({ name: 'demo' })
  })

  test('get returns empty object when missing', () => {
    const request = {
      yar: {
        get: jest.fn(() => null)
      }
    }
    const handler = new SessionHandler()

    const result = handler.get(request, 'claim')

    expect(result).toEqual({})
  })

  test('set forwards to yar', () => {
    const request = {
      yar: {
        set: jest.fn()
      }
    }
    const handler = new SessionHandler()

    handler.set(request, 'claim', { name: 'demo' })

    expect(request.yar.set).toHaveBeenCalledWith('claim', { name: 'demo' })
  })

  test('update merges values and overwrites arrays', () => {
    const existing = { name: 'old', items: ['a'] }
    const request = {
      yar: {
        get: jest.fn(() => existing),
        set: jest.fn()
      }
    }
    const handler = new SessionHandler()

    handler.update(request, 'claim', { name: 'new', items: ['b'], extra: true })

    expect(request.yar.set).toHaveBeenCalledWith('claim', {
      name: 'new',
      items: ['b'],
      extra: true
    })
  })

  test('clear forwards to yar', () => {
    const request = {
      yar: {
        clear: jest.fn()
      }
    }
    const handler = new SessionHandler()

    handler.clear(request, 'claim')

    expect(request.yar.clear).toHaveBeenCalledWith('claim')
  })
})
