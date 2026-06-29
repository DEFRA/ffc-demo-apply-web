import { applyQueueConfig as mqConfig } from '../config/index.js'
import { MessageSender } from 'ffc-messaging'
import createMessage from './create-message.js'
import SessionHandler from '../services/session-handler.js'

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
  await claimSender.closeConnection()
}

export default publishClaim
