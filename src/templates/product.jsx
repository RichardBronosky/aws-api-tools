import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import 'url-search-params-polyfill'
import { setupAnalytics, analyticsProduct } from '../lib/helpers/google-tag-manager'
import { getLastParamOfPath, decodeHtml, slugify } from '../lib/helpers/string-helper'
import { getRegionSkuList } from '../lib/helpers/product'
import { fetchProductBySku } from '../lib/services/product'
import ProductDetail from '../components/product/product-detail'
import ProductLIA from '../components/product/product-lia/product-lia-wrapper'
import '../assets/css/pages/product.sass'
import { getRegionZone } from '../lib/helpers/geo-location'
import { navigate, graphql, StaticQuery } from 'gatsby'
import { productUrl } from '../lib/helpers/route'

export default class S3ProductDetail extends React.Component {
  state = {
    product: this.props.pageContext.product ? JSON.parse(this.props.pageContext.product) : null,
    see_in_room: null,
    room: false,
    storeNum: null,
  }

  componentDidMount() {
    this.setUp()
  }

  componentDidUpdate(prevProps) {
    if (prevProps['*'] !== this.props['*']) {
      this.setUp()
    }
  }

  setUp = () => {
    const product = this.state.product
    if (!this.props.pageContext.product) {
      const sku = getLastParamOfPath()
      if (sku && new RegExp('[0-9]{8}|[0-9]{7}P|[0-9]{7}p').test(sku)) {
        const product = this.getProductBySku(sku)
        if (product && !this.props.location.pathname.includes(slugify(product.title))) {
          const query = new URLSearchParams(this.props.location.search)
          this.setState({
            product: product,
            storeNum: query && query.get('storeCode'),
          })
        }
      } else {
        navigate('/404', { replace: true })
      }
    }
    if (product) {
      this.pageAnalytics(product)
    }
  }

  pageAnalytics(product) {
    if (window && product) {
      setupAnalytics({
        pageData: {
          type: 'product',
          title: product.title,
          path: productUrl(product.title, product.sku),
        },
      })
      window.dataLayer.push({ event: 'ee_detail', ecommerce: { detail: { products: [analyticsProduct(product)] } } })
    }
  }

  getProductBySku = sku => {
    fetchProductBySku(sku).then(product => {
      this.pageAnalytics(product)
      if (!this.props.location.pathname.includes(slugify(product.title))) {
        navigate('/404', { replace: true })
      } else {
        this.setState(
          {
            product: product,
            room: !product.see_in_room,
          },
          () => {
            const region = getRegionZone().region
            const see_in_room_sku = getRegionSkuList(product.see_in_room, region)
            if (see_in_room_sku && see_in_room_sku.length > 0) {
              fetchProductBySku(see_in_room_sku[0].sku).then(room => {
                const roomData = this.generateSeeInRoomObjects(room)
                this.setState({
                  see_in_room: roomData,
                })
              })
            }
          }
        )
      }
    })
  }

  generateSeeInRoomObjects = see_in_room => {
    if (see_in_room.primary_image) {
      let image = see_in_room.primary_image ? see_in_room.primary_image : see_in_room.grid_image
      let link = productUrl(see_in_room.title, see_in_room.sku)
      return {
        image: image,
        link: link,
        title: see_in_room.title,
        product: see_in_room,
      }
    }
  }

  render() {
    const { pageContext } = this.props
    const { product, see_in_room, room, storeNum } = this.state
    return (
      <Layout { ...this.props }>
        <Helmet
          title={ `${ product && product.title ? decodeHtml(product.title) : 'Product' } - Rooms To Go` }
          link={ [
            {
              rel: 'canonical',
              href: typeof window !== 'undefined' && window.location.href,
            },
          ] }
        />
        { product && typeof product !== 'undefined' && !storeNum && product.title && (
          <ProductDetail
            product={ product }
            see_in_room={ see_in_room }
            room={ room }
            banners={ pageContext && pageContext.banners }
          />
        ) }
        { product && typeof product !== 'undefined' && storeNum && product.title && (
          <StaticQuery
            query={ graphql`
              query StoreLIA {
                allContentfulStore {
                  edges {
                    node {
                      id
                      storeNumber
                      storeName
                      storeType
                      address1
                      address2
                      city
                      state
                      zip
                      location {
                        lat
                        lon
                      }
                      phoneNumber
                      storeHours {
                        mondayOpen
                        mondayClosed
                        tuesdayOpen
                        tuesdayClosed
                        wednesdayOpen
                        wednesdayClosed
                        thursdayOpen
                        thursdayClosed
                        fridayOpen
                        fridayClosed
                        saturdayOpen
                        saturdayClosed
                        sundayOpen
                        sundayClosed
                      }
                      neighborhoodsNearby
                      specialClosings {
                        ...Markdown
                      }
                    }
                  }
                }
              }
            ` }
            render={ data => {
              const store = data.allContentfulStore.edges.filter(loc => loc.node.storeNumber === Number(storeNum))
              return <ProductLIA product={ product } store={ store.length > 0 && store[0] && store[0].node } />
            } }
          />
        ) }
      </Layout>
    )
  }
}
