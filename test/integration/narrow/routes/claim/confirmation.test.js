import { createServer } from '../../../../../app/server.js'
import { jest } from '@jest/globals'

describe('Confirmation test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /claim/confirmation route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/claim/confirmation'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
