import Policy from '../../app/routes/cookies/models/cookies-policy.js'

describe('cookies policy view model', () => {
  test('marks yes when analytics enabled', () => {
    const model = new Policy()
    model.ViewModel({ analytics: true }, true)

    expect(model.analytics.items[0].checked).toBe(true)
    expect(model.analytics.items[1].checked).toBe(false)
    expect(model.updated).toBe(true)
  })

  test('marks no when analytics disabled', () => {
    const model = new Policy()
    model.ViewModel({ analytics: false }, false)

    expect(model.analytics.items[0].checked).toBe(false)
    expect(model.analytics.items[1].checked).toBe(true)
    expect(model.updated).toBe(false)
  })
})
