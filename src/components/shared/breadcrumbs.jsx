import React from 'react'
import { graphql } from 'gatsby'
import RTGLink from './link'
import '../../assets/css/components/shared/breadcrumb.sass'

export default ({ data, includeHeading }) => {
  const crumbs = data.crumbs
  return (
    <section
      className="breadcrumb grid-x grid-margin-x"
      key={ 'page-breadcrumbs' }
      role="navigation"
      aria-label="Breadcrumb"
    >
      <ul className="breadcrumbs-list cell small-12">
        <li key="breadcrumb_li_home">
          <RTGLink data={ { slug: '/', text: 'Home' } } />
        </li>
        { crumbs &&
          crumbs.map((crumb, index) => (
            <li key={ `breadcrumb_li_${ crumb.id }` }>
              { (index === crumbs.length - 1 && includeHeading && (
                <h1 className="current" key={ `breadcrumb_heading_${ crumb.id }` }>
                  { crumb.displayText ? crumb.displayText : crumb.text }
                </h1>
              )) || <RTGLink data={ crumb } key={ `breadcrumb_link_${ crumb.id }` } /> }
            </li>
          )) }
      </ul>
    </section>
  )
}

export const breadcrumbsFragment = graphql`
  fragment Breadcrumbs on ContentfulBreadcrumbs {
    crumbs {
      ...Link
    }
  }
`
