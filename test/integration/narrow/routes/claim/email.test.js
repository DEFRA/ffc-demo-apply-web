import { createServer } from '../../../../../app/server.js'
import { jest } from '@jest/globals'

describe('Email test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    jest.resetAllMocks()
    await server.stop()
  })

  test('GET /claim/email route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/claim/email'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
