import createMessage from '../../app/messaging/create-message.js'

describe('create message', () => {
  test('wraps claim with type and source', () => {
    const claim = { claimId: 'MINE123', email: 'test@example.com' }

    const message = createMessage(claim)

    expect(message).toEqual({
      body: claim,
      type: 'uk.gov.demo.claim.submitted',
      source: 'ffc-demo-apply-web'
    })
  })
})
