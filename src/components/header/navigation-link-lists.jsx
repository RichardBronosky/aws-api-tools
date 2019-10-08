import React, { Component } from 'react'
import RTGLink from '../shared/link'
import LinkList from '../shared/link-list'

export default class HeaderLinkList extends Component {
  render() {
    const navLink = this.props.data
    const navPrimaryHeading = navLink.primaryNavLink.displayText
      ? navLink.primaryNavLink.displayText
      : navLink.primaryNavLink.text
    return (
      <div className={ 'sub-nav-link-list' }>
        { this.props.backButton }
        <RTGLink
          data={ navLink.primaryNavLink }
          className="mobile"
          category="navigation"
          action={ `click` }
          label={ navPrimaryHeading }
        />
        { navLink.navLinkSections.map(section => (
          <LinkList data={ section } key={ section.id } category="navigation" />
        )) }
      </div>
    )
  }
}
