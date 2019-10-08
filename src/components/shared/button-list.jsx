import React, { PureComponent } from 'react'
import { graphql } from 'gatsby'
import Button from './button'
import '../../assets/css/components/shared/button-list.sass'

export default class ButtonList extends PureComponent {
  render() {
    const buttonList = this.props.data
    const orientation = buttonList.orientation === 'vertical' ? 'y' : 'x'
    return (
      <>
        { buttonList.buttons && (
          <div className="contentful-button-list">
            <div>
              <h2>{ buttonList.heading }</h2>
              <div className={ `button-list grid-${ orientation } grid-margin-${ orientation }` }>
                { buttonList.buttons.map((button, index) => {
                  return (
                    <div
                      className={ `button-list-button cell small-12 large-${ Math.floor(12 / buttonList.buttons.length) }` }
                      key={ button.contentful_id + index }
                    >
                      <Button
                        data={ button }
                        active={ index + 1 === buttonList.selectedButton && buttonList.selectedButton !== 0 }
                      />
                    </div>
                  )
                }) }
              </div>
            </div>
          </div>
        ) }
      </>
    )
  }
}

export const buttonListFragment = graphql`
  fragment ButtonList on ContentfulButtonList {
    heading
    orientation
    selectedButton
    buttons {
      ...Button
    }
    contentful_id
    __typename
  }
`
