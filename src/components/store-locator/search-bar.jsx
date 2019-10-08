import React from 'react'
import classNames from 'classnames'
import '../../assets/css/components/store-locator/search-bar.sass'
import { keyboardBlur } from '../../lib/helpers/input-helper'

const onEnterPress = (e, changeZip) => {
  if (e.keyCode == 13 && e.shiftKey == false) {
    changeZip()
    keyboardBlur(e)
  }
}

export default ({ title, invalidZip, zipInput, updateInputZipValue, changeZip }) => {
  return (
    <div className="searchbar">
      <span className="seeStore">{ title }</span>
      <label
        className={ classNames({
          invalid: invalidZip,
        }) }
        htmlFor="location"
      >
        { invalidZip && <p className="invalid-message">*Please enter a valid ZIP code</p> }
        <p className="label-text">Enter ZIP code</p>
        <input
          type="text"
          className="zip-input"
          name="location"
          id="location"
          placeholder="ZIP code"
          aria-label="Enter zip code"
          value={ zipInput }
          onChange={ evt => updateInputZipValue(evt) }
          onKeyDown={ e => onEnterPress(e, changeZip) }
        />
        <button
          value="Change zip code"
          name="change_zip"
          className="submit-btn"
          id="submit-btn"
          aria-label="Change zip code"
          gtm-category="see in store"
          gtm-action="change zip code"
          onClick={ changeZip }
        >
          Submit
        </button>
      </label>
    </div>
  )
}
