import config from '../config/index.js'
import yar from '@hapi/yar'

export default {
  plugin: yar,
  options: {
    storeBlank: true,
    maxCookieSize: 1,
    cache: {
      cache: config.cacheName,
      expiresIn: config.sessionTimeoutMinutes * 60 * 1000
    },
    cookieOptions: {
      password: config.cookiePassword,
      // production is currently not https, so a new cookie is created for every request, including css
      // isSecure: config.env === 'production'
      isSecure: false
    }
  }
}
