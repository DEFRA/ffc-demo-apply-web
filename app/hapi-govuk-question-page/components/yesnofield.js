import joi from 'joi'
import { FormComponent } from './index.js'

class YesNoField extends FormComponent {
  constructor (definition) {
    super(definition)

    const options = this.options = this.options || {}
    if (!options.classes) {
      options.classes = 'govuk-radios--inline'
    }

    const { yesFirst = true } = options
    const [yes, no] = [{ text: 'Yes', value: true }, { text: 'No', value: false }]
    const items = yesFirst ? [yes, no] : [no, yes]

    const formSchema = joi.boolean().empty('').required()

    this.items = items
    this.formSchema = formSchema
  }

  getFormSchemaKeys (config) {
    const { name, items } = this
    const { titleForErrorText, nameForErrorText } = this.getTextForErrors(config)
    let { formSchema } = this

    formSchema = formSchema.messages({
      'any.required': `Select ${nameForErrorText}`,
      'string.empty': `Select ${nameForErrorText}`,
      'boolean.base': `${titleForErrorText} must be ${items[0].text} or ${items[1].text}`
    })

    return { [name]: formSchema }
  }

  getDisplayStringFromState (state) {
    const { name, items } = this
    const value = state[name]
    const item = items.find(item => item.value === value)
    return item ? item.text : ''
  }

  getViewModel (config, formData, errors) {
    const { name, items } = this
    const viewModel = super.getViewModel(config, formData, errors)

    Object.assign(viewModel, {
      fieldset: {
        legend: viewModel.label
      },
      items: items.map(({ text, value }) => {
        return {
          text,
          value,
          // Do a loose string based check as state may or
          // may not match the item value types.
          checked: '' + value === '' + formData[name]
        }
      })
    })

    return viewModel
  }
}

export default YesNoField
