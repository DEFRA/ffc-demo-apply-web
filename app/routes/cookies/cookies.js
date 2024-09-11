import Policy from './models/cookies-policy.js'
import { updatePolicy } from '../../cookies/index.js'
import Joi from 'joi'

const cookies = [{
  method: 'GET',
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', new Policy().ViewModel(request.state.cookies_policy, request.query.updated))
  }
}, {
  method: 'POST',
  path: '/cookies',
  options: {
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false)
      })
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect('/cookies?updated=true')
    }
  }
}]

export default cookies
