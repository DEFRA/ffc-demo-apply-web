import SessionHandler from '../../services/session-handler.js'
import { asArray } from '../../util/array-util.js'

const questionPageOptions = {
  ext: {
    onPostHandler: {
      method: async (request, h) => {
        if (request.app['hapi-govuk-question-page']) {
          const dataToSet = request.app['hapi-govuk-question-page'].data
          if (dataToSet.mineType !== undefined) {
            dataToSet.mineType = asArray(dataToSet.mineType)
          }
          new SessionHandler().update(request, 'claim', dataToSet)
        }
        return h.continue
      }
    }
  }
}

export default questionPageOptions
