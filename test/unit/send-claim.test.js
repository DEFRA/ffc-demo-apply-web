import { jest } from '@jest/globals'

const ORIGINAL_ENV = { ...process.env }

const buildSubmit = async ({ claim, publishClaimImpl } = {}) => {
  jest.resetModules()
  const publishClaimMock = jest.fn(publishClaimImpl)
  const getMock = jest.fn(() => claim)

  jest.unstable_mockModule('../../app/messaging/publish-claim', () => ({
    publishClaim: publishClaimMock
  }))

  jest.unstable_mockModule('../../app/services/session-handler', () => ({
    default: class SessionHandler {
      get (...args) {
        return getMock(...args)
      }
    }
  }))

  const { default: submit } = await import('../../app/services/send-claim.js')
  return { submit, publishClaimMock, getMock }
}

describe('send claim', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    jest.restoreAllMocks()
  })

  test('submits claim and logs success', async () => {
    const claim = { claimId: 'MINE123' }
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const { submit, publishClaimMock, getMock } = await buildSubmit({
      claim,
      publishClaimImpl: jest.fn()
    })

    const result = await submit({ headers: {} })

    expect(result).toBe(true)
    expect(getMock).toHaveBeenCalledWith(expect.anything(), 'claim')
    expect(publishClaimMock).toHaveBeenCalledWith(claim)
    expect(logSpy).toHaveBeenCalledWith('Submitting claim MINE123')
  })

  test('returns false when publish fails', async () => {
    const claim = { claimId: 'MINE123' }
    const error = new Error('boom')
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { submit, publishClaimMock } = await buildSubmit({
      claim,
      publishClaimImpl: () => {
        throw error
      }
    })

    const result = await submit({ headers: {} })

    expect(result).toBe(false)
    expect(publishClaimMock).toHaveBeenCalledWith(claim)
    expect(errorSpy).toHaveBeenCalledWith(error)
  })
})
