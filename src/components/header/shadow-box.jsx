import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import '../../assets/css/global/shadow-box.sass'
import { getFromBrowserStorage, saveLocalStorage } from '../../lib/helpers/storage'
import ContentGroup from '../shared/content-group'
import { canPublishContent } from '../../lib/helpers/contentful'

export default class ShadowBox extends React.Component {
  setupShadowBox = content => {
    if (content) {
      if (getFromBrowserStorage('local', 'shadowBox')) {
        return getFromBrowserStorage('local', 'shadowBox') === 'show'
      } else {
        saveLocalStorage('shadowBox', 'show')
        return true
      }
    } else {
      localStorage.removeItem('shadowBox')
      return false
    }
  }

  closeShadowBox = () => {
    saveLocalStorage('shadowBox', 'hide')
    if (window) {
      window.location.reload()
    }
  }

  render() {
    return (
      <StaticQuery
        query={ graphql`
          query ShadowBoxQuery {
            contentfulContentGroup(contentful_id: { eq: "33cugy3JU4nNe2Tv05WlEb" }) {
              ...ContentGroup
            }
          }
        ` }
        render={ data => (
          <>
            { data && data.contentfulContentGroup && this.setupShadowBox(data.contentfulContentGroup.groupContent) && (
              <section className="shadow-box">
                <button className="shadow-box-close" onClick={ () => this.closeShadowBox() }>
                  <span className="hide508">Close</span>
                  <img
                    className="icon close"
                    aria-hidden="true"
                    role="presentation"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /%3E%3C/svg%3E"
                  />
                </button>
                <ContentGroup data={ data.contentfulContentGroup } />
              </section>
            ) }
          </>
        ) }
      />
    )
  }
}
