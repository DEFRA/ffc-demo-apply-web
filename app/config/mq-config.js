import Joi from 'joi'

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    type: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    managedIdentityClientId: Joi.string(),
    useEmulator: Joi.bool().default(false)
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
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    useEmulator: process.env.NODE_ENV !== 'production'
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

export default applyQueueConfig
