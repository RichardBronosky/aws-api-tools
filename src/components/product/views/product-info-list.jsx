import React from 'react'
import { getStockMessage, getRegionSkuList } from '@helpers/product'
import { announce, taskDone } from '@helpers/aria-announce'
import { getRegionZone } from '@helpers/geo-location'
import SaleFlag from '@shared/sale-flag'
import SimpleSlider from '@shared/slider'
import classNames from 'classnames'
import AddToCart from '../product-parts/product-add-to-cart'
import ProductFinancing from '../product-parts/product-financing'
import ProductLocation from '../product-parts/product-location'
import ProductPrice from '../product-parts/product-price'
import Variations from '../product-parts/product-variations'
import ProductAddOns from '../product-parts/product-add-ons'
import ProductUpgrades from '../product-parts/product-upgrades'
import ProductTitlePricing from '../product-parts/product-title-pricing'

import ProductImageZooom from '../product-parts/product-image-zoom'

export default class ProductInfoList extends React.Component {
  constructor(props) {
    super(props)
    this.zoomBtn = React.createRef()
  }

  state = {
    zoomIndex: -1,
    requiredSelected: null,
    activeAddons: [],
    mobileZoom: false,
  }

  componentDidMount() {
    getStockMessage(this.props.product, this.setStockMessage)
    this.updateScrollPosition()
    window.addEventListener('scroll', this.updateScrollPosition)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleWindowEvents)
  }

  handleWindowEvents = e => {
    if (this.state.zoomIndex == 0) {
      if (e.key == 'Escape' || e.key == 'Enter' || e.keyCode == 32) {
        e.preventDefault()

        this.setState({ zoomIndex: -1 })
        if (this.zoomBtn && this.zoomBtn.current) {
          this.zoomBtn.current.setAttribute('aria-pressed', 'false')
          taskDone(
            () => {
              this.zoomBtn.current.children[0].focus()
            },
            500,
            'focusZoom'
          )
        }
      }
    }
  }

  handleZoomToggle(e, zoom) {
    if (!e) return
    e.stopPropagation()

    if (e.type == 'click' || e.key == 'Enter' || e.keyCode == 32) {
      e.preventDefault()

      this.setState(zoom)
      let isZoomed = zoom.zoomIndex == 0 ? true : false
      if (this.zoomBtn && this.zoomBtn.current) {
        this.zoomBtn.current.setAttribute('aria-pressed', isZoomed)
      }
      if (isZoomed) {
        announce('Image Zoomed')
        window.addEventListener('keydown', this.handleWindowEvents)
      } else {
        announce('Image Zoom Closed')
        window.removeEventListener('keydown', this.handleWindowEvents)
      }
    }

    if (e.key == 'Escape') {
      window.removeEventListener('keydown', this.handleWindowEvents)
      announce('Image Zoom Closed')
      this.setState({ zoomIndex: -1 })

      if (this.zoomBtn && this.zoomBtn.current) {
        this.zoomBtn.current.setAttribute('aria-pressed', 'false')
        taskDone(
          () => {
            this.zoomBtn.current.children[0].focus()
          },
          500,
          'focusZoom'
        )
      }
    }
  }

  setStockMessage = message => {
    this.setState({
      stockMessage: message,
    })
  }

  onChangeRequiredAddons = (value, requiredAddon) => {
    this.setState(
      {
        requiredSelected: value,
      },
      () => (value ? this.onRequiredAddonChange(requiredAddon, true) : this.onRequiredAddonChange(requiredAddon, false))
    )
  }

  updateScrollPosition = () => {
    if (window.scrollY > 860 && !this.state.scrolled) {
      this.setState({
        scrolled: true,
      })
    } else if (window.scrollY <= 860 && this.state.scrolled) {
      this.setState({
        scrolled: false,
      })
    }
  }

  onRequiredAddonChange = (requiredAddon, add) => {
    const { product } = this.props
    if (product.addon_items && requiredAddon && requiredAddon.skus) {
      let requiredAddons = []
      for (let i = 0, n = requiredAddon.skus.length; i < n; i++) {
        requiredAddons.push(product.addon_items.filter(addon => addon.sku === requiredAddon.skus[i])[0])
      }
      let activeAddons = this.state.activeAddons
      for (let i = 0, n = requiredAddons.length; i < n; i++) {
        add
          ? (activeAddons = [...activeAddons, requiredAddons[i]])
          : (activeAddons = activeAddons.filter(addon => addon.sku !== requiredAddons[i].sku))
      }
      this.setState({ activeAddons: activeAddons })
    }
  }

  addonAddProduct = product => {
    this.setState(prevState => ({
      activeAddons: [...prevState.activeAddons, product],
    }))
  }

  addonRemoveProduct = product => {
    let activeAddons = this.state.activeAddons.filter(addon => addon.sku !== product.sku)
    this.setState({ activeAddons: activeAddons })
  }

  render() {
    const {
      product,
      price,
      strikethrough,
      strikethroughPrice,
      availability,
      sale,
      fullWidth,
      variationCount,
      isMobile,
      index,
      addons,
      showFinance,
      financeAmount,
      promotions,
    } = this.props
    const { zoomIndex, activeAddons, requiredSelected, scrolled } = this.state
    let images = [product.primary_image || product.high_res_image]
    if (product.alternate_images) {
      images = images.concat(product.alternate_images)
    }
    const room_configurations = product.room_configurations
      ? getRegionSkuList(product.room_configurations, getRegionZone().region)
      : null
    return (
      <div
        className={ classNames('product-tile pdp-page card', {
          'pop-out': !fullWidth,
          wide: fullWidth,
        }) }
      >
        { product && scrolled && (
          <div className="product-info-sticky card">
            <ProductTitlePricing
              product={ product }
              showImage={ true }
              addons={ addons }
              requiredSelected={ requiredSelected }
              activeAddons={ activeAddons }
              strikethrough={ strikethrough }
              strikethroughPrice={ strikethroughPrice }
              showFinance={ showFinance }
              financeAmount={ financeAmount }
            />
          </div>
        ) }
        <div />
        { product && (
          <div className="item product">
            { sale && !promotions && <SaleFlag className="sale-flag">Sale</SaleFlag> }
            <div className="product-image cell small-10">
              <span id="imageZoomInstructions" className="hide508">
                Press enter to toggle zoom.
              </span>
              <SimpleSlider
                data={ {
                  heading: '',
                } }
                dots={ true }
                maxSlides={ 1 }
              >
                { images.map((image, index) => (
                  <div key={ index }>
                    <ProductImageZooom image={ image } product={ product } isMobile={ isMobile } />
                  </div>
                )) }
              </SimpleSlider>
              <div onClick={ () => this.setState({ zoomIndex: zoomIndex !== -1 ? -1 : index }) } className="zoomIcon">
                <i className="fas fa-search-plus" title="Click image to zoom" />
              </div>
              <div className="grid-x" />
            </div>
            <div className="small-12">
              <h2 className="product-title" dangerouslySetInnerHTML={ { __html: product.title } } />
            </div>
            <div className="product-details-section cell small-2">
              <div className="product-details-data grid-x grid-margin-x">
                { fullWidth && (
                  <div className="instock-instore cell small-12 medium-6 large-3">
                    <ProductLocation list product={ product } stockMessage={ this.state.stockMessage } />
                  </div>
                ) }
                <div className="product-variation-title cell small-12 medium-6 large-5 grid-x">
                  <div className="product-info cell small-12 ">
                    { product.variations && fullWidth && (
                      <div className="product-variations cell small-12 grid-y ">
                        <div className="product-variation-swatches list grid-x grid-margin-x">
                          <Variations
                            variationCount={ variationCount }
                            variations={ product.variations.color }
                            heading="COLOR"
                            productSku={ product.sku }
                          />
                          <Variations
                            variationCount={ variationCount }
                            variations={ product.variations.finish }
                            heading="FINISH"
                            productSku={ product.sku }
                          />
                          <div className="size-variation small-12">
                            <Variations
                              variationCount={ variationCount }
                              variations={ product.variations.size }
                              heading="SIZE"
                              productSku={ product.sku }
                              noImage={ true }
                            />
                          </div>
                        </div>
                      </div>
                    ) }
                  </div>
                </div>
                <div
                  className={ classNames('product-pricing  small-12 medium-4', {
                    'large-4': fullWidth,
                  }) }
                >
                  <div className="grid-x list-price-container">
                    <div className="product-price-financing cell small-6 large-3 grid-y">
                      <div
                        className={ classNames('product-list-price cell small-7 large-7', {
                          'showing-finance': showFinance,
                        }) }
                      >
                        <ProductPrice
                          price={ price }
                          strikethroughPrice={ strikethroughPrice }
                          sale={ sale }
                          strikethrough={ strikethrough }
                        />
                      </div>
                      { showFinance && (
                        <div className="product-list-financing cell small-4 large-2">
                          <ProductFinancing financeAmount={ financeAmount } />
                        </div>
                      ) }
                    </div>
                    <div className="product-list-availability  small-6 large-4">
                      <AddToCart
                        availability={ availability }
                        product={ product }
                        price={ price }
                        componentPage="pdp"
                        stockMessage={ this.state.stockMessage }
                        index={ index }
                        addons={ addons }
                        requiredSelected={ requiredSelected }
                        activeAddons={ activeAddons }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { fullWidth && (
              <div className="product-variations cell small-12 grid-y ">
                { product.upgrade_items && (
                  <div className="upgrade-section">
                    <div className="cell small-12">
                      <ProductUpgrades
                        currentProductPrice={ price }
                        productSku={ product.sku }
                        upgrades={ product.upgrade_items }
                        heading="OPTIONS"
                        filterAvailability
                      />
                    </div>
                  </div>
                ) }
                { product.addon_items && addons && (
                  <div className="cell small-12">
                    <ProductAddOns
                      addons={ addons }
                      heading="ADD:"
                      requiredHeading="ITEMS REQUIRED FOR PROPER ASSEMBLY:"
                      hasInfoModal={ true }
                      addonAddProduct={ this.addonAddProduct }
                      addonRemoveProduct={ this.addonRemoveProduct }
                      activeAddons={ activeAddons }
                      requiredSelected={ requiredSelected }
                      onChangeRequiredAddons={ this.onChangeRequiredAddons }
                    />
                  </div>
                ) }
                { product.variations && product.variations.team && (
                  <div className="grid-x ">
                    { product.variations.team && (
                      <div className="product-variations-teams small-12 ">
                        <div className="cell small-12 ">
                          <Variations
                            variations={ product.variations.team }
                            heading="CHOOSE YOUR TEAM"
                            type="team"
                            isMobile={ isMobile }
                            productSku={ product.sku }
                          />
                        </div>
                      </div>
                    ) }
                  </div>
                ) }
                { room_configurations && (
                  <div className="upgrade-section">
                    <div className="cell small-12">
                      <ProductUpgrades
                        currentProductPrice={ price }
                        productSku={ product.sku }
                        upgrades={ getRegionSkuList(product.room_configurations, getRegionZone().region) }
                        heading="OTHER ROOM PACKAGES"
                        labelPrefix={ 'Includes:' }
                        includeTitle
                      />
                    </div>
                  </div>
                ) }
              </div>
            ) }
          </div>
        ) }
      </div>
    )
  }
}
