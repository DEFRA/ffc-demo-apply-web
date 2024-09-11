import { createServer } from '../../../../app/server'
import { jest } from '@jest/globals'

describe('Home test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET / route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
