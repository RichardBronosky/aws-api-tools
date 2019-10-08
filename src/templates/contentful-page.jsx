import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import classNames from 'classnames'
import { CreateContent } from '../lib/helpers/contentful-mapping'
import Layout from '../components/layout'
import Accordion from '../components/shared/accordion.jsx'
import { selectRegionBasedContent } from '../lib/helpers/contentful'
import { removeFirstAndLastSlash } from '../lib/helpers/string-helper'
import '../assets/css/components/shared/contentful-page.sass'
import { setupAnalytics } from '../lib/helpers/google-tag-manager'
import Breadcrumbs from '../components/shared/breadcrumbs'

export default class ContentfulPage extends React.Component {
  componentDidMount() {
    const contentfulPage = this.props.data.contentfulPage
    setupAnalytics({
      pageData: {
        type: contentfulPage.pageType,
        title: contentfulPage.title,
        cid: contentfulPage.contentful_id,
        path: contentfulPage.route,
      },
    })
  }
  render() {
    const contentfulPage = this.props.data.contentfulPage
    const hasMatchPath =
      removeFirstAndLastSlash(this.props.location.pathname) === removeFirstAndLastSlash(contentfulPage.route)
    const contentfulComponents = selectRegionBasedContent(process.env.GATSBY_RTG_REGION, contentfulPage)
    const breadcrumbs =
      contentfulComponents && contentfulComponents.filter(c => c.__typename === 'ContentfulBreadcrumbs')
    return (
      <Layout { ...this.props }>
        { contentfulPage.seo && hasMatchPath && (
          <>
            { contentfulPage.seo.pageTitle && <Helmet title={ contentfulPage.seo.pageTitle } /> }
            { contentfulPage.seo.canonical && (
              <Helmet
                link={ [
                  {
                    rel: 'canonical',
                    href: contentfulPage.seo.canonical,
                  },
                ] }
              />
            ) }
            { contentfulPage.seo.metaDescription && (
              <Helmet
                meta={ [
                  {
                    name: 'description',
                    content: contentfulPage.seo.metaDescription.metaDescription,
                  },
                ] }
              />
            ) }
            { contentfulPage.seo.metaRobots && (
              <Helmet
                meta={ [
                  {
                    name: 'robots',
                    content: contentfulPage.seo.metaRobots,
                  },
                ] }
              />
            ) }
            { contentfulPage.seo.jsonLdSchema && (
              <Helmet
                script={ [
                  {
                    type: 'application/ld+json',
                    innerHTML: contentfulPage.seo.jsonLdSchema.jsonLdSchema,
                  },
                ] }
              />
            ) }
          </>
        ) }
        <div className="generated-page">
          { (breadcrumbs || (contentfulPage.seo && contentfulPage.seo.pageHeading)) && hasMatchPath && (
            <section
              className={ classNames('seo-page-heading full-width hide', {
                show: hasMatchPath,
              }) }
            >
              <div className="grid-container ">
                <div className="grid-x grid-margin-x">
                  <div className="cell small-12">
                    { (breadcrumbs && breadcrumbs.length > 0 && (
                      <Breadcrumbs data={ breadcrumbs[0] } includeHeading={ true } />
                    )) ||
                      (contentfulPage.seo && contentfulPage.seo.pageHeading && (
                        <h1>{ contentfulPage.seo.pageHeading }</h1>
                      )) }
                  </div>
                </div>
              </div>
            </section>
          ) }
          { contentfulPage.seo && !contentfulPage.seo.pageHeading && <h1 className="home-heading">Rooms To Go Home</h1> }
          { contentfulPage && CreateContent(contentfulComponents, this.props, hasMatchPath) }
          { contentfulPage.seo && contentfulPage.seo.accordion && hasMatchPath && (
            <div className={ classNames('hide', { show: hasMatchPath }) }>
              <Accordion data={ contentfulPage.seo.accordion } />
            </div>
          ) }
        </div>
      </Layout>
    )
  }
}

export const contentfulPageFragment = graphql`
  query contentfulPageNode($pageId: String!) {
    contentfulPage(id: { eq: $pageId }) {
      ...ContentfulPage
    }
  }
`

export const contentfulPageDataFragment = graphql`
  fragment ContentfulPage on ContentfulPage {
    title
    route
    pageType
    seo {
      ...ContentfulSeo
    }
    contentDefault: content {
      __typename
      ...ContentfulText
      ...Banner
      ...Slider
      ...Grid
      ...SearchQuery
      ...Accordion
      ...AccordionList
      ...Breadcrumbs
      ...ContentfulHtml
      ...RecentlyViewed
      ...Markdown
      ...ButtonList
      ...ContentGroup
    }
    contentOom {
      __typename
      ...ContentfulText
      ...Banner
      ...Slider
      ...Grid
      ...SearchQuery
      ...Accordion
      ...AccordionList
      ...Breadcrumbs
      ...RecentlyViewed
      ...Markdown
      ...ButtonList
      ...ContentGroup
    }
    contentSe {
      __typename
      ...ContentfulText
      ...Banner
      ...Slider
      ...Grid
      ...SearchQuery
      ...Accordion
      ...AccordionList
      ...Breadcrumbs
      ...RecentlyViewed
      ...Markdown
      ...ButtonList
      ...ContentGroup
    }
    contentFl {
      __typename
      ...ContentfulText
      ...Banner
      ...Slider
      ...Grid
      ...SearchQuery
      ...Accordion
      ...AccordionList
      ...Breadcrumbs
      ...RecentlyViewed
      ...Markdown
      ...ButtonList
      ...ContentGroup
    }
    contentTx {
      __typename
      ...ContentfulText
      ...Banner
      ...Slider
      ...Grid
      ...SearchQuery
      ...Accordion
      ...AccordionList
      ...Breadcrumbs
      ...RecentlyViewed
      ...Markdown
      ...ButtonList
      ...ContentGroup
    }
    contentful_id
    __typename
  }
`

export const contentfulSeoFragment = graphql`
  fragment ContentfulSeo on ContentfulSeo {
    id
    pageTitle
    pageHeading
    canonical
    metaRobots
    metaDescription {
      metaDescription
    }
    jsonLdSchema {
      jsonLdSchema
    }
    accordion {
      ...Accordion
    }
    contentful_id
  }
`
