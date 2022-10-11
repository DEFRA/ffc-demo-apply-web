const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string(),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object(),
    username: joi.string(),
    password: joi.string()
  },
  applyQueue: {
    address: joi.string()
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined,
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

module.exports = {
  applyQueueConfig
}
