import { Component } from './index.js'

class Para extends Component {
  getViewModel () {
    return {
      content: this.content
    }
  }
}

export default Para
