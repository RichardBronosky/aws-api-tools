import React from 'react'
import { graphql } from 'gatsby'
import { StaticQuery } from 'gatsby'
import ContentGroup from './content-group'
import SimpleSlider from './slider'
import ProductTile from '../product/product-tile'
import '../../assets/css/components/shared/promotion-content-group.sass'

export default class PromotionContentGroup extends React.PureComponent {
  render() {
    const { targetSkus, isCart } = this.props
    let promoSliderArr
    if (targetSkus && targetSkus.length > 0) {
      promoSliderArr = targetSkus
    }
    return (
      <StaticQuery
        query={ graphql`
          query ContentGroupQuery {
            contentfulContentGroup(contentful_id: { eq: "19VDTXva8KUCtdnkVV7Wem" }) {
              ...ContentGroup
            }
          }
        ` }
        render={ data => (
          <>
            { data &&
              promoSliderArr &&
              data.contentfulContentGroup &&
              data.contentfulContentGroup.groupContent &&
              data.contentfulContentGroup.groupContent.length > 0 && (
                <div className="promotion-content-group">
                  <ContentGroup data={ data.contentfulContentGroup } />
                  <SimpleSlider
                    data={ {
                      heading: 'Select Your Bonus Umbrella', // TODO: make this Contentful controlled
                    } }
                    maxSlides={ isCart ? 3 : 4 }
                  >
                    { promoSliderArr.map((sku, index) => (
                      <ProductTile sku={ sku } key={ sku } viewType="grid" index={ index } />
                    )) }
                  </SimpleSlider>
                </div>
              ) }
          </>
        ) }
      />
    )
  }
}
