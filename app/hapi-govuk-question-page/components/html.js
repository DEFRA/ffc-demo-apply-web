import { Component } from './index.js'

class Html extends Component {
  getViewModel () {
    return {
      content: this.content
    }
  }
}

export default Html
