import Hapi from '@hapi/hapi'
import HapiPino from 'hapi-pino'
import Joi from 'joi'
import inert from '@hapi/inert'
import vision from '@hapi/vision'

import view from './plugins/views.js'
import config from './config/index.js'
import redisCache from '@hapi/catbox-redis'
import memoryCache from '@hapi/catbox-memory'
import sessionCache from './plugins/session-cache.js'
import hapiGovukQuestionPage from './hapi-govuk-question-page/index.js'

// routes
import healthy from './routes/healthy.js'
import healthz from './routes/healthz.js'
import home from './routes/home.js'
import { routeAssets, routeStatics } from './routes/statics.js'
import clearSession from './routes/clear-session.js'
import cookies from './routes/cookies/cookies.js'

import claimName from './routes/claim/name.js'
import claimPropertyType from './routes/claim/property-type.js'
import claimAccessible from './routes/claim/accessible.js'
import claimDateOfSubsidence from './routes/claim/date-of-subsidence.js'
import claimMineType from './routes/claim/mine-type.js'
import claimEmail from './routes/claim/email.js'
import claimConfirmatiton from './routes/claim/confirmation.js'

const catbox = config.useRedis ? redisCache : memoryCache

const createServer = () => {
  const server = Hapi.server({
    port: process.env.PORT,
    cache: [{
      name: config.cacheName,
      provider: {
        constructor: catbox.Engine,
        options: config.catboxOptions
      }
    }]
  })

  const routes = [].concat(
    healthy,
    healthz,
    home,
    routeAssets,
    routeStatics,
    clearSession,
    cookies,
    claimName,
    claimPropertyType,
    claimAccessible,
    claimDateOfSubsidence,
    claimMineType,
    claimEmail,
    claimConfirmatiton
  )

  server.validator(Joi)
  server.register(inert)
  server.register(view)
  server.register(vision)
  server.register(hapiGovukQuestionPage)
  server.route(routes)
  server.register({
    plugin: HapiPino,
    options: {
      logPayload: true,
      level: 'warn'
    }
  })
  server.register(sessionCache)
  return server
}

export { createServer }
