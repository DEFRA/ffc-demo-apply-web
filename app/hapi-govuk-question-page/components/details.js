import { Component } from './index.js'

class Details extends Component {
  getViewModel () {
    return {
      summaryHtml: this.title,
      html: this.content
    }
  }
}

export default Details
