import Joi from 'joi'
import { FormComponent } from './index.js'

class SelectField extends FormComponent {
  constructor (definition) {
    super(definition)

    const { options: { required, filterable, list: { type: listType, items: listItems = [] } = {} } = {} } = this
    this.listItems = listItems
    const listValues = listItems.map(listItem => listItem.value)
    this.listType = listType
    this.listValues = listValues

    let formSchema = Joi.array()
    if (required === false) {
      formSchema = formSchema.allow('')
    } else {
      formSchema = formSchema.empty('').required()
    }

    if (!filterable) {
      formSchema = formSchema.valid(...listValues)
    }

    this.formSchema = formSchema
  }

  getFormSchemaKeys (config = {}) {
    const { name, listValues, options: { filterable } = {} } = this
    const { titleForErrorText, nameForErrorText } = this.getTextForErrors(config)
    let { formSchema } = this
    const { [name]: { filter } = {} } = config

    if (filterable) {
      let values = listValues
      if (filter && Array.isArray(filter)) {
        values = values.filter(value => filter.includes(value))
        values = values.length < 2 ? listValues : values
      }
      formSchema = formSchema.valid(...values)
    }

    formSchema = formSchema.messages({
      'any.required': `Select ${nameForErrorText}`,
      'string.empty': `Select ${nameForErrorText}`,
      'any.only': `${titleForErrorText} must be from the list`
    })

    return { [name]: formSchema }
  }

  getDisplayStringFromState (state) {
    const { name, listItems } = this
    const value = state[name]
    const item = listItems.find(item => item.value === value)
    return item ? item.text : ''
  }

  getViewModel (config, formData, errors) {
    const { name, options: { filterable } = {}, listItems = [] } = this
    const { [name]: { filter } = {} } = config
    const viewModel = super.getViewModel(config, formData, errors)

    let items = listItems
    if (filterable && filter && Array.isArray(filter)) {
      items = items.filter(({ value }) => filter.includes(value))
      items = items.length < 2 ? listItems : items
    }

    Object.assign(viewModel, {
      items: [{ text: '' }].concat(items.map(item => {
        return {
          text: item.text,
          value: item.value,
          // Do a loose check as state may or
          // may not match the item value types
          selected: '' + item.value === '' + formData[name]
        }
      }))
    })

    return viewModel
  }
}

export default SelectField
