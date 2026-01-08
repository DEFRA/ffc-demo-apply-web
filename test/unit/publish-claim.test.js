import { PublishEvent } from 'ffc-protective-monitoring'
import SessionHandler from '../../app/services/session-handler'
import { MessageSender } from 'ffc-messaging'
import publishClaim from '../../app/messaging/publish-claim'

import { jest } from '@jest/globals'

const mockSendEvent = jest
  .spyOn(PublishEvent.prototype, 'sendEvent')
  .mockImplementation(() => {
    console.log('mocked function sendEvent')
  })

const mockSendMessage = jest
  .spyOn(MessageSender.prototype, 'sendMessage')
  .mockImplementation(() => {
    console.log('mocked function sendMessage')
  })

const mockCloseConnection = jest
  .spyOn(MessageSender.prototype, 'closeConnection')
  .mockImplementation(() => {})

const request = {
  headers: {
    'x-forwarded-for': '127.0.0.1'
  }
}

const claim = {
  claimId: 'MINE1',
  propertyType: 'business',
  accessible: false,
  dateOfSubsidence: '2019-07-26T09:54:19.622Z',
  mineType: ['gold', 'silver'],
  email: 'joe.bloggs@defra.gov.uk'
}

const mockGet = jest
  .spyOn(SessionHandler.prototype, 'get')
  .mockImplementation((request, key) => {
    console.log('mocked function sendMessage')
    return claim
  })

describe('publish claim', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should publish claim', async () => {
    await publishClaim(request)
    expect(mockSendEvent).toHaveBeenCalledTimes(1)
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('SIGTERM closes connection and exits', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})

    await publishClaim(request)
    process.emit('SIGTERM')

    await new Promise(process.nextTick)

    expect(mockCloseConnection).toHaveBeenCalledTimes(2)
    expect(exitSpy).toHaveBeenCalledWith(0)
  })

  test('SIGINT closes connection and exits', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})

    await publishClaim(request)
    process.emit('SIGINT')

    await new Promise(process.nextTick)

    expect(mockCloseConnection).toHaveBeenCalledTimes(2)
    expect(exitSpy).toHaveBeenCalledWith(0)
  })
})
