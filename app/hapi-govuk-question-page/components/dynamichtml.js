import { escapeHtml } from '@hapi/hoek'

import { Component } from './index.js'

const PARAMETER_TOKEN = /\$PARAM\$/g

class DynamicHtml extends Component {
  getViewModel (config) {
    const { templateHtml } = this

    const { [this.name]: { parameterValues = [] } = {} } = config
    const cleanParameterValues = parameterValues.map(parameterValue => escapeHtml('' + parameterValue))

    const content = templateHtml.replace(PARAMETER_TOKEN, () => cleanParameterValues.shift() || '')

    return {
      content
    }
  }
}

export default DynamicHtml
