import React from 'react'
import { connect } from 'react-redux'
import ProductInfoGrid from './views/product-info-grid'
import ProductInfoList from './views/product-info-list'
import { productAvailability, productPrice, productOnSale, isProductStrikeThrough } from '../../lib/helpers/product'
import { productFinancing } from '../../lib/helpers/finance'

class ProductInfo extends React.Component {
  state = {
    currentImage: null,
    addons: null,
    showFinance: false,
    financeAmount: 0,
  }

  componentDidMount() {
    this.setUp(this.props.data)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setUp(this.props.data)
    }
  }

  setUp = product => {
    this.setAddons(product)
    const finance = productFinancing(productPrice(product))
    this.setState({
      financeAmount: finance.financeAmount,
      showFinance: finance.financeAmount >= 10,
    })
  }

  setImage = image => {
    this.setState({
      currentImage: image,
    })
  }

  setAddons = product => {
    const addons = product.addon_items
    if (addons) {
      this.setState({ addons: addons })
    }
  }

  render() {
    const {
      data,
      fullWidth,
      gridWidth,
      viewType,
      index,
      isMobile,
      source,
      displayQuantity,
      promotions,
      orderedProductVariations,
      setProduct,
      last,
    } = this.props
    const { showFinance, financeAmount } = this.state
    const product = data
    const price = productPrice(product)
    const strikethrough = isProductStrikeThrough(product)
    const strikethroughPrice = productPrice(product, true)
    const availability = productAvailability(product)
    const sale = productOnSale(product)
    const variationCount = product && product.variation_types ? Object.keys(product.variation_types).length : 0
    return (
      <>
        { viewType === 'grid' && (
          <ProductInfoGrid
            product={ product }
            fullWidth={ fullWidth }
            price={ price }
            strikethrough={ strikethrough }
            strikethroughPrice={ strikethroughPrice }
            availability={ availability }
            sale={ sale }
            currentImage={ this.state.currentImage }
            setImage={ this.setImage }
            variationCount={ variationCount }
            isMobile={ isMobile }
            index={ index }
            source={ source }
            gridWidth={ gridWidth }
            addons={ this.state.addons }
            displayQuantity={ displayQuantity }
            showFinance={ showFinance }
            financeAmount={ financeAmount }
            setProduct={ setProduct }
            orderedProductVariations={ orderedProductVariations }
            last={ last }
          />
        ) }
        { viewType === 'list' && (
          <ProductInfoList
            product={ product }
            fullWidth={ fullWidth }
            price={ price }
            strikethrough={ strikethrough }
            strikethroughPrice={ strikethroughPrice }
            availability={ availability }
            sale={ sale }
            currentImage={ this.state.currentImage }
            setImage={ this.setImage }
            variationCount={ variationCount }
            isMobile={ isMobile }
            index={ index }
            source={ source }
            gridWidth={ gridWidth }
            addons={ this.state.addons }
            showFinance={ showFinance }
            financeAmount={ financeAmount }
            promotions={ promotions }
          />
        ) }
      </>
    )
  }
}

const mapStateToProps = state => {
  return { ...state.global }
}

export default connect(
  mapStateToProps,
  null
)(ProductInfo)
