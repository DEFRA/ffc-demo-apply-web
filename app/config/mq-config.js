import Joi from 'joi'
import applicationinsights from 'applicationinsights'
const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    type: Joi.string(),
    appInsights: Joi.object(),
    username: Joi.string(),
    password: Joi.string()
  },
  applyQueue: {
    address: Joi.string()
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? applicationinsights : undefined,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  applyQueue: {
    address: process.env.APPLY_QUEUE_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const applyQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.applyQueue }

export default { applyQueueConfig }
