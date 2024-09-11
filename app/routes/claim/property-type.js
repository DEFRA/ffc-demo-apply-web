import SessionHandler from '../../services/session-handler.js'
import pageDefinition from './page-definitions/date-of-subsidence.js'
import questionsOptions from './question-page-options.js'

const route = {
  method: ['GET', 'POST'],
  path: '/claim/property-type',
  handler: {
    'hapi-govuk-question-page': {
      getConfig: () => {
        return {
          $VIEW$: { serviceName: 'FFC Demo Service' }
        }
      },
      getData: (request) => new SessionHandler().get(request, 'claim'),
      getNextPath: () => './accessible',
      pageDefinition
    }
  },
  options: questionsOptions
}
export default route
