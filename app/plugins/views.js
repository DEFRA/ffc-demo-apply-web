import nunjucks from 'nunjucks'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { config } from '../config/index.js'
import vision from '@hapi/vision'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const views = {
  plugin: vision,
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return context => template.render(context)
        }
      }
    },
    relativeTo: __dirname,
    compileOptions: {
      environment: nunjucks.configure([
        join(__dirname, '../views'),
        join(__dirname, '../app', 'dist'),
        'node_modules/govuk-frontend/dist/'
      ])
    },
    path: '../views',
    context: {
      appVersion: process.env.npm_package_version,
      assetpath: '/node_modules/govuk-frontend/dist/assets',
      govukAssetpath: '/govuk/assets',
      serviceName: 'FFC Demo Apply Web',
      pageTitle: 'FFC Demo Apply Web - GOV.UK',
      googleTagManagerKey: config.googleTagManagerKey,
      analyticsTagKey: config.analyticsTagKey,
      startPageUrl: config.startPageUrl
    }
  }
}
export default views
