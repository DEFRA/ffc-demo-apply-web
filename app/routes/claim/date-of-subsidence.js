import SessionHandler from '../../services/session-handler.js'
import pageDefinition from './page-definitions/date-of-subsidence.js'
import questionsOptions from './question-page-options.js'

const route = {
  method: ['GET', 'POST'],
  path: '/claim/date-of-subsidence',
  handler: {
    'hapi-govuk-question-page': {
      getConfig: async () => {
        return {
          $VIEW$: { serviceName: 'FFC Demo Service' }
        }
      },
      getData: (request) => {
        const { dateOfSubsidence } = new SessionHandler().get(request, 'claim')
        const date = dateOfSubsidence ? new Date(dateOfSubsidence) : undefined
        return { dateOfSubsidence: date }
      },
      setData: async (request, data) => {
        const dateOfSubsidence = data.dateOfSubsidence
        if (dateOfSubsidence > new Date()) {
          return {
            errors: { titleText: 'Fix the following errors', errorList: [{ href: '#dateOfSubsidence', name: 'dateOfSubsidence', text: 'Date has to be in the past' }] }
          }
        }
      },
      getNextPath: () => './mine-type',
      pageDefinition
    }
  },
  options: questionsOptions
}

export default route
