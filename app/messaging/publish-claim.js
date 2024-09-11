import { applyQueueConfig as mqConfig } from '../config/index.js'
import { MessageSender } from 'ffc-messaging'
import createMessage from './create-message.js'
import SessionHandler from '../services/session-handler.js'
import ProtectiveMonitoring from '../services/protective-monitoring-service.js'

let claimSender

async function stop () {
  await claimSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function publishClaim (request) {
  claimSender = new MessageSender(mqConfig)
  const claim = new SessionHandler().get(request, 'claim')
  const message = createMessage(claim)
  await claimSender.sendMessage(message)
  const protectiveMonitoring = new ProtectiveMonitoring()
  await protectiveMonitoring.sendEvent(request, claim, 'Claim submitted')
  await claimSender.closeConnection()
}

export default publishClaim
