import { jest } from '@jest/globals'
import generateId from '../../app/services/id-service.js'

describe('id service', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  test('generateId uses UTC milliseconds with MINE prefix', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01T00:00:00.789Z'))

    const result = generateId()

    expect(result).toEqual('MINE789')
  })
})
