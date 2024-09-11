import SessionHandler from '../services/session-handler.js'

const route = {
  method: 'GET',
  path: '/clear-session',
  options: {
    handler: (request, h) => {
      new SessionHandler().clear(request, 'claim')
      return h.redirect('/')
    }
  }
}

export default route
