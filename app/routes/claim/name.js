import SessionHandler from '../../services/session-handler.js'
import pageDefinition from './page-definitions/date-of-subsidence.js'
import questionsOptions from './question-page-options.js'

const route = {
  method: ['GET', 'POST'],
  path: '/claim/name',
  handler: {
    'hapi-govuk-question-page': {
      getConfig: () => {
        return {
          $VIEW$: { serviceName: 'FFC Demo Service' }
        }
      },
      getData: (request) => new SessionHandler().get(request, 'claim'),
      getNextPath: () => './property-type',
      pageDefinition
    }
  },
  options: questionsOptions
}
export default route
