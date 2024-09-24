import MultilineTextField from './multilinetextfield.js'

class CharacterCountField extends MultilineTextField {
  getViewModel (config, formData, errors) {
    const { options: { threshold } = {}, schema: { max, maxwords } = {} } = this
    const viewModel = super.getViewModel(config, formData, errors)

    delete viewModel.attributes.maxlength
    if (maxwords) {
      viewModel.maxwords = maxwords
    } else {
      viewModel.maxlength = max
    }
    if (threshold) {
      viewModel.threshold = threshold
    }

    return viewModel
  }
}

export default CharacterCountField
