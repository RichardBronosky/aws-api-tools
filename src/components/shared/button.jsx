import React, { PureComponent } from 'react'
import { graphql } from 'gatsby'
import RTGLink from './link'
import classNames from 'classnames'
import '../../assets/css/components/shared/button.sass'
import { contentfulImage } from '../../lib/helpers/contentful'

export default class Button extends PureComponent {
  getIconPosition(iconPosition) {
    var position
    switch (iconPosition) {
      case 'top':
        position = 'button-content-top small-12'
        break
      case 'left':
        position = 'button-content-left small-6'
        break
      case 'right':
        position = 'button-content-right small-6'
        break
      default:
        position = ''
    }
    return position
  }
  getIconPositionTop(iconPositionTop) {
    if (iconPositionTop === 'right') {
      return 'flex-reverse'
    }
    return ''
  }
  render() {
    const button = this.props.data
    const container = this.props.container
    const contentIndex = this.props.index
    let trackingData = this.props.trackingData ? this.props.trackingData : {}
    if (container) {
      if (container.type === 'banner') {
        trackingData = {
          event: 'ee_promoClick',
          ecommerce: {
            promoClick: {
              promotions: [{ contentIndex: contentIndex, banner: container.label, button: button.name }],
            },
          },
        }
      }
    }
    if (button) {
      const backgroundColor = button.backgroundColor ? button.backgroundColor : 'none'
      const iconActive = this.props.active
      const iconImage = iconActive ? button.iconActive : button.icon
      const buttonStyle = {
        color: button.textColor,
        borderColor: button.borderColor,
        backgroundColor: backgroundColor,
      }
      return (
        button.link && (
          <RTGLink
            data={ button.link }
            className={ classNames('button grid-x', this.getIconPositionTop(button.iconPosition), {
              border: button.displayBorder,
              'display-icon': button.displayIcon,
            }) }
            style={ buttonStyle }
            category={ this.props.category ? this.props.category : 'button' }
            action={ this.props.action ? this.props.action : 'click' }
            label={ this.props.label ? this.props.label : button.text }
            value={ this.props.value ? this.props.value : this.props.index }
            trackingData={ trackingData }
            noAriaLabel={ true }
          >
            { button.displayIcon && button.icon && (
              <span className={ classNames('button-icon-image', this.getIconPosition(button.iconPosition)) }>
                <img src={ iconImage ? contentfulImage(iconImage.file.url) : '/' } alt={ button.text } />
              </span>
            ) }
            <span className={ classNames('button-text', this.getIconPosition(button.iconPosition)) }>
              { button.displayText && button.text }
            </span>
          </RTGLink>
        )
      )
    } else {
      return null
    }
  }
}

export const buttonFragment = graphql`
  fragment Button on ContentfulButton {
    name
    link {
      ...Link
    }
    icon {
      ...Image
    }
    iconActive {
      ...Image
    }
    iconPosition
    displayIcon
    text
    displayBorder
    displayText
    textColor
    borderColor
    backgroundColor
    contentful_id
  }
`
