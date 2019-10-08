import React from 'react'
import classNames from 'classnames'
import RTGLink from '../../shared/link'

const MenuUpperLinks = props => (
  <div
    className={ classNames('mobile-menu-top-split', {
      active: !props.mobileSubNavActive,
    }) }
  >
    <RTGLink
      data={ {
        slug: '/stores',
        category: 'header',
        action: 'location click',
        label: 'location',
      } }
    >
      <img
        className="icon location"
        alt=""
        src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2052.44%2075.69%22%20fill%3D%22%232f5294%22%3E%3Ctitle%3Eicon-location%3C%2Ftitle%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cpath%20d%3D%22M52.44%2C26.22A26.22%2C26.22%2C0%2C0%2C0%2C0%2C26.22q0%2C.66%2C0%2C1.32c0%2C.44%2C0%2C.87%2C0%2C1.32C0%2C43.34%2C26.22%2C75.69%2C26.22%2C75.69S52.44%2C43.34%2C52.44%2C28.86q0-.67%2C0-1.32T52.44%2C26.22ZM26.22%2C39.52A12.17%2C12.17%2C0%2C1%2C1%2C38.39%2C27.35h0A12.17%2C12.17%2C0%2C0%2C1%2C26.22%2C39.52Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
      />
      <span>Store Locator</span>
    </RTGLink>
    { /* <button tabIndex="0" value="My Account" aria-label="My Account">
      <i className="icon profile" />
      <span>My Account</span>
    </button> */ }
  </div>
)

export default MenuUpperLinks
