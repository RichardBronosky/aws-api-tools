import React from 'react'
import { genKey } from '../helpers/string-helper'
import { canPublishContent } from '../helpers/contentful'
import { InView } from 'react-intersection-observer'

import ContentfulText from '../../components/shared/contentful-text'
import Image from '../../components/shared/image'
import Link from '../../components/shared/link'
import Button from '../../components/shared/button'
import ButtonList from '../../components/shared/button-list'
import Slider from '../../components/shared/slider'
import Banner from '../../components/shared/banner'
import Accordion from '../../components/shared/accordion'
import AccordionList from '../../components/shared/accordion-list'
import CategoryTile from '../../components/category-tile'
import ProductTile from '../../components/product/product-tile'
import CollectionTile from '../../components/collection-tile'
import SearchQuery from '../../components/search/search-query'
import ContentfulHtml from '../../components/shared/contentful-html'
import Grid from '../../components/shared/grid'
import RecentlyViewed from '../../components/shared/recently-viewed'
import Markdown from '../../components/shared/markdown'
import Coupon from '../../components/shared/coupon'
import ContentGroup from '../../components/shared/content-group'

export const ContentfulMappings = {
  ContentfulImage: Image,
  ContentfulText: ContentfulText,
  ContentfulLink: Link,
  ContentfulButton: Button,
  ContentfulButtonList: ButtonList,
  ContentfulSlider: Slider,
  ContentfulBanner: Banner,
  ContentfulAccordion: Accordion,
  ContentfulAccordionList: AccordionList,
  ContentfulCategoryTile: CategoryTile,
  ContentfulProductTile: ProductTile,
  ContentfulCollectionTile: CollectionTile,
  ContentfulSearchQuery: SearchQuery,
  ContentfulHtml: ContentfulHtml,
  ContentfulGridXHorizontal: Grid,
  ContentfulRecentlyViewed: RecentlyViewed,
  ContentfulMarkdown: Markdown,
  ContentfulCoupon: Coupon,
  ContentfulContentGroup: ContentGroup,
}

export const CreateContent = function(content, page, isMatchPathPage = false, container) {
  let contentComponents = []
  let contentIndex = 1
  if (content) {
    for (let section of content) {
      if (
        (ContentfulMappings[section.__typename] || section.__typename === 'ContentfulBanner') &&
        canPublishContent(section)
      ) {
        if (isMatchPathPage || section.__typename === 'ContentfulSearchQuery') {
          const contentKey = section.contentful_id + genKey() || genKey()
          let elem = React.createElement(
            ContentfulMappings[section.__typename] || (section.__typename === 'ContentfulBanner' && Banner),
            {
              data: section,
              key: contentKey,
              index: contentIndex,
              container: container,
              page,
            }
          )
          let content = (
            <InView as="div" data-cid={ section.contentful_id } key={ contentKey + genKey() } triggerOnce={ true }>
              { elem }
            </InView>
          )
          contentComponents.push(content)
        }
        contentIndex++
      }
    }
  }
  return contentComponents
}
