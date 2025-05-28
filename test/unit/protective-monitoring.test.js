import { PublishEvent } from 'ffc-protective-monitoring'
import ProtectiveMonitoring from '../../app/services/protective-monitoring-service'
import { jest } from '@jest/globals'
jest.mock('ffc-protective-monitoring')

const mockSendEvent = jest
  .spyOn(PublishEvent.prototype, 'sendEvent')
  .mockImplementation(() => {
    console.log('mocked function sendEvent')
  })

let request

describe('send protective monitoring event', () => {
  const claim = {
    claimId: 'MINE1',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }

  test('should send protective monitoring payload with x-forwarded-for header', async () => {
    request = {
      headers: {
        'x-forwarded-for': '127.0.0.1'
      }
    }
    const protectiveMonitoring = new ProtectiveMonitoring()
    await protectiveMonitoring.sendEvent(request, claim, 'Test message')
    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })

  test('should send protective monitoring payload with remoteAddress', async () => {
    request = {
      headers: {
      },
      info: {
        remoteAddress: '127.0.0.1'
      }
    }

    const protectiveMonitoring = new ProtectiveMonitoring()
    await protectiveMonitoring.sendEvent(request, claim, 'Test message')
    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })
})
