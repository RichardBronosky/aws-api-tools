import React from 'react'
import '../../assets/css/components/shared/sale-flag.sass'

export default ({ className, children, onClick }) => (
  <span
    onClick={ () => {
      onClick ? onClick() : null
    } }
    className={ `${ className ? className : '' } sale-flag` }
  >
    { children ? children : <></> }
  </span>
)
