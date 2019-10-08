import React from 'react'
import { removeCamelCase } from '../../../lib/helpers/string-helper'
import '../../../assets/css/components/checkout/checkout-parts/checkout-error-message.sass'

export default ({ invalidFields, customMessage }) => (
  <>
    { customMessage && <p className="invalid-message">*{ customMessage }</p> }
    { !customMessage && invalidFields && invalidFields.length > 0 && (
      <p className="invalid-message">
        *Invalid{ ' ' }
        { invalidFields.map((field, index) => {
          const newField = removeCamelCase(field)
          if (invalidFields.length === 1) {
            return newField
          } else if (invalidFields.length === 2) {
            return index !== invalidFields.length - 1 ? newField + ' ' : 'and ' + newField
          } else {
            return index !== invalidFields.length - 1 ? newField + ', ' : 'and ' + newField
          }
        }) }
      </p>
    ) }
  </>
)
