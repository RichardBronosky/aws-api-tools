import React from 'react'
import { productPrice } from '@helpers/product'
import { stripHtml } from '@helpers/string-helper'
import { productUrl } from '@helpers/route'

export default function ProductJsonLd({ product }) {
  const data = `{ 
    "@context": "http://schema.org/",
    "@type": "Product",
    "name": "${ product.title }",
    "image": "${ [].concat(product.primary_image).concat(product.alternate_images) }",
    "description": "${ product.description ? stripHtml(product.description) : '' }",
    "sku": "${ product.sku }",
    "brand": {
      "@type": "Thing",
      "name": "${ product.brand ? product.brand : 'Rooms To Go' }"
    },
    "offers": {
      "@type": "Offer",
      "url": "${ window && window.location.origin }${ productUrl(product.title, product.sku) }",
      "priceCurrency": "USD",
      "price": "${ productPrice(product) }",
      "itemCondition": "http://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Rooms To Go"
      }
    }
  }`

  return <script type="application/ld+json" dangerouslySetInnerHTML={ { __html: data } } />
}
