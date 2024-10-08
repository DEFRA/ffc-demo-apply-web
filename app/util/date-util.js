import moment from 'moment'

const dateUtil = {
  buildDate: function (year, month, day, validate) {
    if (validate) {
      const testDate = moment([year, month - 1, day])
      if (!testDate.isValid()) {
        throw new Error('Invalid date')
      }
    }
    return new Date(year, month - 1, day)
  }
}

export default dateUtil
