import SessionHandler from '../../services/session-handler.js'
import ViewModel from './models/confirmation.js'

const sessionHandler = new SessionHandler()
const route = {
  method: 'GET',
  path: '/claim/confirmation',
  handler: (request, h) => {
    const claim = sessionHandler.get(request, 'claim')
    return h.view('claim/confirmation', new ViewModel(claim))
  }
}

export default route
