import { Component } from './index.js'

class InsetText extends Component {
  getViewModel () {
    return {
      content: this.content
    }
  }
}

export default InsetText
