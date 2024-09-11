import { config } from '../config/index.js'

export const routeAssets = {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'node_modules/govuk-frontend/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}
export const routeStatics = {
  method: 'GET',
  path: '/static/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'app/dist',
          'node_modules/govuk-frontend/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}
export default { routeAssets, routeStatics }
