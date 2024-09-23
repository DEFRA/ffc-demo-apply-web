import { Component } from './index.js'

class WarningText extends Component {
  getViewModel () {
    return {
      text: this.text,
      iconFallbackText: this.summary || 'Warning'
    }
  }
}

export default WarningText
