import React, { PureComponent } from 'react'
import { graphql } from 'gatsby'
import { CreateContent } from '../../lib/helpers/contentful-mapping'
import '../../assets/css/components/shared/accordion-list.sass'

export default class AccordionList extends PureComponent {
  render() {
    const accordionList = this.props.data
    return (
      <div className="accordion-list">
        <span className="heading">{ accordionList.heading }</span>
        { accordionList.list && CreateContent(accordionList.list, null, true) }
      </div>
    )
  }
}

export const accordionListFragment = graphql`
  fragment AccordionList on ContentfulAccordionList {
    heading
    list {
      ...Accordion
    }
    contentful_id
    __typename
  }
`
