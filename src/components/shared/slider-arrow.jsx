import React from 'react'
import { sliderfix } from '../../lib/helpers/aria-slider'

export default ({ text, caption, describedby, classNames, heading, instance, onClick }) => (
  <button
    type="button"
    data-role="none"
    className={ classNames }
    gtm-category="slider"
    gtm-action="slider scroll"
    gtm-label={ heading }
    onClick={ () => {
      try {
        onClick()
      } catch (e) {}
      sliderfix(instance, 'click')
    } }
    aria-describedby={ describedby ? describedby : null }
  >
    <svg
      role="presentation"
      aria-hidden="true"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      preserveAspectRatio="xMinYMin"
    >
      { text.includes('Next') ? (
        <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z" />
      ) : (
        <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
      ) }
    </svg>
    <span className="hide508">{ `${ text } for ${ caption ? caption : heading ? heading : '' }` }</span>
  </button>
)
