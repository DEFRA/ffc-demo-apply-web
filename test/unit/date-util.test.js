import dateUtil from '../../app/util/date-util.js'

describe('date util', () => {
  test('buildDate returns expected date when valid', () => {
    const result = dateUtil.buildDate(2024, 2, 29, true)
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toEqual(2024)
    expect(result.getMonth()).toEqual(1)
    expect(result.getDate()).toEqual(29)
  })

  test('buildDate throws when validation fails', () => {
    expect(() => dateUtil.buildDate(Number.NaN, 1, 1, true)).toThrow('Invalid date')
  })

  test('buildDate skips validation when disabled', () => {
    const result = dateUtil.buildDate(Number.NaN, 1, 1, false)
    expect(Number.isNaN(result.getTime())).toBe(true)
  })
})
