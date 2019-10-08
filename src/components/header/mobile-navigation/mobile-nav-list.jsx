import React, { Component } from 'react'
import classNames from 'classnames'
import RTGLink from '../../shared/link'
import arrowForward from '../../../assets/images/icons8-forward-24.png'

export default class MobileNavList extends Component {
  getNavLink = link => {
    if (link.primaryNavLink) {
      return link.primaryNavLink.displayText ? link.primaryNavLink.displayText : link.primaryNavLink.text
    } else if (link.headingLink) {
      return link.headingLink.displayText ? link.headingLink.displayText : link.headingLink.text
    } else if (link.displayText || link.text) {
      return link.displayText ? link.displayText : link.text
    }
    return ''
  }

  render() {
    const { activeNavId, navLinkId, links, final } = this.props

    return (
      <div>
        { activeNavId === navLinkId && (
          <ul className="head--mobile-navigation-button active">
            { links &&
              links.map(link => {
                let newLink = link
                if (link.headingLink) {
                  newLink = link.headingLink
                }
                return (
                  <li
                    key={ newLink.id }
                    className={ classNames('head--navigation-item active', {
                      'section-head': final && link.headingLink,
                    }) }
                  >
                    <RTGLink
                      data={ newLink }
                      className={ classNames('head--mobile-navigation-button active', {
                        'final-link': final && !link.headingLink,
                      }) }
                      category="navigation"
                      action="link click"
                      label={ this.getNavLink(link) }
                    >
                      { this.getNavLink(link) }
                      { !final &&
                        (!newLink.slug &&
                          (!newLink.internalUrl || (newLink.internalUrl && !newLink.internalUrl.url))) && (
                          <img className="arrowForward" aria-hidden="false" src={ arrowForward } />
                        ) }
                    </RTGLink>
                  </li>
                )
              }) }
          </ul>
        ) }
      </div>
    )
  }
}
