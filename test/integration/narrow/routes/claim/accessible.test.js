import { createServer } from '../../../../../app/server.js'
import { jest } from '@jest/globals'

describe('Accessible test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /claim/accessible route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/claim/accessible'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
