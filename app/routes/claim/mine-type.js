import SessionHandler from '../../services/session-handler.js'
import pageDefinition from './page-definitions/date-of-subsidence.js'
import questionsOptions from './question-page-options.js'

const route = {
  method: ['GET', 'POST'],
  path: '/claim/mine-type',
  handler: {
    'hapi-govuk-question-page': {
      getConfig: async () => {
        return {
          $VIEW$: { serviceName: 'FFC Demo Service' }
        }
      },
      getData: (request) => new SessionHandler().get(request, 'claim'),
      getNextPath: () => './email',
      pageDefinition
    }
  },
  options: questionsOptions
}
export default route
