import React from 'react'
import RTGLink from '../../shared/link'
import classNames from 'classnames'

const MenuLowerLinks = props => (
  <ul
    className={ classNames('header--mobile-nav-menu-list bottom-links', {
      active: !props.mobileSubNavActive,
    }) }
  >
    <li>
      <RTGLink
        data={ {
          slug: '/credit/options',
          title: 'Credit Card',
          category: 'mobile header',
          action: 'Credit Card click',
          label: 'Credit Card',
        } }
        className="link"
      >
        Credit Card
      </RTGLink>
    </li>
    <li>
      <RTGLink
        data={ {
          url: 'https://www1.roomstogo.com/product/adults/GIFT-CARD/83333333/',
          title: 'Gift Card',
          category: 'mobile header',
          action: 'Gift Card click',
          label: 'Gift Card',
        } }
        className="link"
      >
        Gift Card
      </RTGLink>
    </li>
    <li>
      <RTGLink
        data={ {
          slug: '/customer-service/common-questions',
          title: 'Customer Service',
          category: 'mobile header',
          action: 'Customer Service click',
          label: 'Customer Service',
        } }
        className="link"
      >
        Customer Service
      </RTGLink>
    </li>
  </ul>
)

export default MenuLowerLinks
