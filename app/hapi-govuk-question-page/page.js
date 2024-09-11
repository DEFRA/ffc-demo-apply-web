import joi from 'joi'
import TextField from './components/textfield.js'
import MultilineTextField from './components/multilinetextfield.js'
import CharacterCountField from './components/charactercountfield.js'
import YesNoField from './components/yesnofield.js'
import DatePartsField from './components/datepartsfield.js'
import SelectField from './components/selectfield.js'
import RadiosField from './components/radiosfield.js'
import CheckboxesField from './components/checkboxesfield.js'
import CheckboxesWithTextField from './components/checkboxeswithtextfield.js'
import NumberField from './components/numberfield.js'
import NamesField from './components/namesfield.js'
import TelephoneNumberField from './components/telephonenumberfield.js'
import EmailAddressField from './components/emailaddressfield.js'
import Para from './components/para.js'
import Html from './components/html.js'
import DynamicHtml from './components/dynamichtml.js'
import InsetText from './components/insettext.js'
import Details from './components/details.js'
import WarningText from './components/warningtext.js'

const componentTypes = {}

componentTypes.TextField = TextField
componentTypes.MultilineTextField = MultilineTextField
componentTypes.CharacterCountField = CharacterCountField
componentTypes.YesNoField = YesNoField
componentTypes.DatePartsField = DatePartsField
componentTypes.SelectField = SelectField
componentTypes.RadiosField = RadiosField
componentTypes.CheckboxesField = CheckboxesField
componentTypes.CheckboxesWithTextField = CheckboxesWithTextField
componentTypes.NumberField = NumberField
componentTypes.NamesField = NamesField
componentTypes.TelephoneNumberField = TelephoneNumberField
componentTypes.EmailAddressField = EmailAddressField
componentTypes.Para = Para
componentTypes.Html = Html
componentTypes.DynamicHtml = DynamicHtml
componentTypes.InsetText = InsetText
componentTypes.Details = Details
componentTypes.WarningText = WarningText

const DEFAULT_PAGE_TITLE = 'Question'
const DEFAULT_SUBMIT_BUTTON_TEXT = 'Continue'
const ERROR_SUMMARY_TITLE = 'Fix the following errors'
const VALIDATION_OPTIONS = { abortEarly: false }

const mapErrorsForDisplay = (joiError) => {
  return {
    titleText: ERROR_SUMMARY_TITLE,
    errorList: joiError.details.map(err => {
      const name = err.path[0]

      return {
        href: `#${name}`,
        name,
        text: err.message
      }
    })
  }
}

class Page {
  constructor (pageDef, pageTemplateName) {
    const { title, caption, submitButtonText = DEFAULT_SUBMIT_BUTTON_TEXT, hasNext = true } = pageDef
    this.title = title
    this.submitButtonText = submitButtonText
    this.caption = caption
    this.hasNext = hasNext
    this.pageTemplateName = pageTemplateName

    const components = pageDef.components.map(def => new componentTypes[def.type](def))
    const formComponents = components.filter(component => component.isFormComponent)

    // Components collection
    this.components = components
    this.formComponents = formComponents
    this.hasFormComponents = !!formComponents.length
    this.hasSingleFormComponentFirst = formComponents.length === 1 && formComponents[0] === components[0]
  }

  getViewModel (config = {}, formData, errors) {
    const { $PAGE$: pageConfig = {}, $VIEW$: customViewData = {} } = config
    let {
      title: pageTitle = this.title,
      caption: pageCaption = this.caption,
      submitButtonText: buttonText = this.submitButtonText
    } = pageConfig
    let showTitle = Boolean(pageTitle)

    const templateName = this.pageTemplateName
    const useForm = this.hasFormComponents || this.hasNext

    const components = this.components.map(component => ({
      type: component.type,
      isFormComponent: component.isFormComponent,
      model: component.getViewModel(config, formData, errors)
    }))

    if (!showTitle) {
      if (this.hasSingleFormComponentFirst) {
        const label = components[0].model.label

        if (pageCaption) {
          label.html = `<span class="govuk-caption-xl">${pageCaption}</span> ${label.text}`
        }

        label.isPageHeading = true
        label.classes = 'govuk-label--xl'
        pageTitle = label.text
      } else {
        pageTitle = DEFAULT_PAGE_TITLE
        showTitle = true
      }
    }

    return { templateName, pageTitle, pageCaption, showTitle, buttonText, useForm, components, errors, ...customViewData }
  }

  getFormDataFromState (state, config) {
    return this.formComponents.reduce((acc, formComponent) => {
      Object.assign(acc, formComponent.getFormDataFromState(state, config))
      return acc
    }, {})
  }

  getStateFromValidForm (validatedFormData, config) {
    return this.formComponents.reduce((acc, formComponent) => {
      Object.assign(acc, formComponent.getStateFromValidForm(validatedFormData, config))
      return acc
    }, {})
  }

  validateForm (payload, config) {
    const formSchemaKeys = this.formComponents.reduce((acc, formComponent) => {
      Object.assign(acc, formComponent.getFormSchemaKeys(config))
      return acc
    }, {})
    const formSchema = joi.object().keys(formSchemaKeys).required()
    const result = formSchema.validate(payload, VALIDATION_OPTIONS)
    const errors = result.error ? mapErrorsForDisplay(result.error) : null

    return { value: result.value, errors }
  }
}

export default Page
