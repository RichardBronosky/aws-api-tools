import React from 'react'
import classNames from 'classnames'
import '../../assets/css/components/shared/location-fields.sass'

export default ({ inputRef, error, addressInput, onChange, noAutoComplete, id }) => (
  <div className="location-fields">
    <label className="label-header" htmlFor={ 'location' + id }>
      Enter City and State, or Zip Code
      { error && (
        <div className="error">
          <p>*Please enter a valid USA city and state, or zip code.</p>
        </div>
      ) }
    </label>
    <input
      ref={ inputRef }
      type="text"
      className={ classNames('input-field', {
        error: error,
      }) }
      name="location"
      id={ 'location' + id }
      aria-required="true"
      aria-invalid={ error ? true : false }
      placeholder="Example: Atlanta, GA or 30312"
      value={ addressInput }
      onChange={ e => onChange(e) }
      autoComplete={ noAutoComplete ? 'off' : '' }
    />
    <button className="blue-action-btn" value="Change Location" name="change_location_btn">
      Change Location
    </button>
  </div>
)
