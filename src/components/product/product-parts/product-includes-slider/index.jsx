import React from 'react'
import { titleCase } from '@helpers/string-helper'
import { productUrl } from '@helpers/route'
import RTGLink from '@shared/link'
import SimpleSlider from '@shared/slider'
import './product-includes-slider.sass'

export default ({ items_in_room, heading }) => (
  <div className="includes-slider-container small-12">
    <SimpleSlider
      data={ {
        heading,
        sliderSize: 'Small',
      } }
    >
      { items_in_room.map(item => (
        <div key={ item.sku }>
          { item.image && item.generic_name && (
            <>
              { !item.title && (
                <div className="card">
                  <div className="slider-image-container">
                    <div className="slider-image">
                      <img src={ `${ item.image }&h=250` } alt="" role="presentation" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="slider-title">{ `${ titleCase(item.generic_name) }${
                    item.quantity > 1 ? ` (${ item.quantity })` : ''
                  }` }</div>
                </div>
              ) }
              { item.title && (
                <RTGLink
                  className="card"
                  noTabIndex={ true }
                  aria-describedby={ `title${ item.sku }` }
                  data={ {
                    url: productUrl(item.title, item.sku),
                  } }
                >
                  <div className="slider-image-container">
                    <div className="slider-image">
                      <img src={ `${ item.image }&h=250` } alt="" role="presentation" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="slider-title">{ `${ titleCase(item.generic_name) }${
                    item.quantity > 1 ? ` (${ item.quantity })` : ''
                  }` }</div>
                </RTGLink>
              ) }
            </>
          ) }
        </div>
      )) }
    </SimpleSlider>
  </div>
)
