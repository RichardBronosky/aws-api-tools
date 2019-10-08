import React from 'react'
import classNames from 'classnames'
import '../../../assets/css/components/checkout/checkout-parts/checkout-input.sass'

const Input = ({
  className,
  type,
  field,
  label,
  additional,
  info,
  setInfo,
  afterComponent,
  name,
  radioValue,
  invalidFields,
  textType,
  radioType,
  placeholder,
  required,
}) => {
  let classes
  classes = classNames(className, {
    invalid: invalidFields && (invalidFields.includes(field) || invalidFields.includes(className)),
  })
  return (
    <>
      <input
        type={ type }
        id={ field }
        className={ classes ? classes : className }
        placeholder={ textType ? placeholder : '' }
        aria-required={ required }
        aria-invalid={ required && classes ? true : required ? false : null }
        value={ getValue(textType, radioType, radioValue, info, field) }
        checked={ getChecked(textType, radioType, radioValue, info, field) }
        name={ radioType ? name : label }
        onChange={ e => (!radioType ? setInfo(textType ? e.target.value : e.target.checked, field) : null) }
        onClick={ () => (radioType ? setInfo(radioValue, field) : null) }
      />
      <span>{ afterComponent && afterComponent }</span>
    </>
  )
}

export default class CheckoutInput extends React.Component {
  render() {
    const { type, field, label, additional, required } = this.props
    let labelText
    const placeholder = label
    if (required) {
      labelText = `${ label }*`
    } else {
      labelText = label
    }
    const textType = type === 'text' || type === 'email' || type === 'tel'
    const radioType = type === 'radio'
    return (
      <>
        { textType && (
          <label className={ classNames('label', field) } htmlFor={ field }>
            { labelText } { additional ? <span className="hide508">{ additional }</span> : null }
            <Input
              { ...this.props }
              textType={ textType }
              radioType={ radioType }
              labelText={ labelText }
              placeholder={ placeholder }
            />
          </label>
        ) }
        { !textType && (
          <Input
            { ...this.props }
            textType={ textType }
            radioType={ radioType }
            labelText={ labelText }
            placeholder={ placeholder }
          />
        ) }
      </>
    )
  }
}

const getChecked = (textType, radioType, radioValue, info, field) => {
  if (textType) {
    return false
  } else if (radioType) {
    if (info.financePlan && info.financePlan.code ? info.financePlan.code === radioValue.code : radioValue) {
      return info[field]
    } else {
      return !info[field]
    }
  } else {
    return info[field]
  }
}

const getValue = (textType, radioType, radioValue, info, field) => {
  if (textType) {
    return info[field]
  } else if (radioType) {
    return radioValue
  } else {
    return ''
  }
}
