import React from 'react'
import { graphql } from 'gatsby'
import classNames from 'classnames'
import SlickSlider from 'react-slick'
import RTGLink from '../shared/link'
import Responsive from 'react-responsive'
import '../../assets/css/components/shared/slider/slick.scss'
import '../../assets/css/components/shared/slider/slick-theme.scss'
import '../../assets/css/components/shared/slider.sass'
import { CreateContent } from '../../lib/helpers/contentful-mapping'
import SliderArrow from './slider-arrow'
import { sliderfix } from '../../lib/helpers/aria-slider'

const Small = props => <Responsive { ...props } maxWidth={ 680 } />
const Medium = props => <Responsive { ...props } minWidth={ 681 } maxWidth={ 1024 } />
const Large = props => <Responsive { ...props } minWidth={ 1025 } maxWidth={ 1499 } />
const Desktop = props => <Responsive { ...props } minWidth={ 1500 } />

export default class SimpleSlider extends React.PureComponent {
  constructor(props) {
    super(props)
    this.sliderEle = React.createRef()
  }

  render() {
    const slider = this.props.data
    const maxSlides = this.props.maxSlides
    const minSlides = this.props.minSlidesMobile
    const contentComponents = slider.slides ? CreateContent(slider.slides, this.props.page, true) : this.props.children
    const infinite = false
    const initialSlide = this.props.initialSlide ? this.props.initialSlide : 0
    const lazyLoad = true
    const nextArrow = (
      <SliderArrow
        text="Next"
        caption={ slider.caption }
        describedby={ slider.describedby }
        classNames="slick-next"
        instance={ this.sliderEle }
        heading={ slider.heading }
      />
    )
    const prevArrow = (
      <SliderArrow
        text="Previous"
        caption={ slider.caption }
        describedby={ slider.describedby }
        classNames="slick-prev"
        instance={ this.sliderEle }
        heading={ slider.heading }
      />
    )
    const dots = this.props.dots
    const includeTitle = this.props.includeTitle

    if (contentComponents) {
      let compare = maxSlides
        ? contentComponents.length > maxSlides
          ? maxSlides
          : contentComponents.length
        : contentComponents.length > 1
        ? 1
        : 1
      const settingsSmall = {
        accessibility: false,
        infinite: infinite,
        lazyLoad: lazyLoad,
        speed: 500,
        initialSlide: initialSlide,
        slidesToShow: minSlides ? minSlides : 1,
        slidesToScroll: minSlides ? minSlides - 1 : 1,
        dots: dots,
        arrows: !dots,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        onInit: sliderfix(this.sliderEle, 'init'),
      }

      compare = maxSlides
        ? contentComponents.length > maxSlides
          ? maxSlides
          : contentComponents.length
        : contentComponents.length > 2
        ? 2
        : 1
      const settingsMedium = {
        accessibility: false,
        infinite: infinite,
        lazyLoad: lazyLoad,
        speed: 500,
        slidesToShow: minSlides ? minSlides : 2,
        slidesToScroll: minSlides ? minSlides - 1 : 1,
        initialSlide: initialSlide,
        dots: false,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        onInit: sliderfix(this.sliderEle, 'init'),
      }

      compare = maxSlides
        ? contentComponents.length > maxSlides
          ? maxSlides
          : contentComponents.length
        : contentComponents.length > 3
        ? 3
        : contentComponents.length
      const settingsLarge = {
        accessibility: false,
        lazyLoad: lazyLoad,
        speed: 500,
        slidesToShow: compare,
        slidesToScroll: compare > 1 ? compare - 1 : compare,
        initialSlide: initialSlide,
        infinite: infinite,
        dots: false,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        onInit: sliderfix(this.sliderEle, 'init'),
      }

      compare = maxSlides
        ? contentComponents.length > maxSlides
          ? maxSlides
          : contentComponents.length
        : contentComponents.length > 4
        ? 4
        : contentComponents.length
      const settingsDesktop = {
        accessibility: false,
        lazyLoad: lazyLoad,
        speed: 500,
        slidesToShow: compare,
        slidesToScroll: compare > 1 ? compare - 1 : compare,
        initialSlide: initialSlide,
        infinite: infinite,
        dots: false,
        focusOnSelect: this.props.focusOnSelect,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        onInit: sliderfix(this.sliderEle, 'init'),
      }

      if (slider.viewAllLink) {
        if (slider.viewAllLink.displayText && !slider.viewAllLink.displayText.includes('>')) {
          slider.viewAllLink.displayText = slider.viewAllLink.displayText + ' >'
        } else if (slider.viewAllLink.text && !slider.viewAllLink.text.includes('>')) {
          slider.viewAllLink.text = slider.viewAllLink.text + ' >'
        }
      }
      return (
        <section
          ref={ this.sliderEle }
          className={ classNames('slider', {
            small: slider.sliderSize && slider.sliderSize === 'Small',
          }) }
        >
          <div className="slider-head">
            <div id={ slider.ariaId } className="slider-heading">
              { slider.heading && (
                <h2>
                  <span className="hide508">{ slider.ariaNote } </span>
                  { slider.heading }
                </h2>
              ) }
            </div>
            <div className="slider-link">{ slider.viewAllLink && <RTGLink data={ slider.viewAllLink } /> }</div>
          </div>
          <Small>
            <SlickSlider { ...settingsSmall }>{ contentComponents }</SlickSlider>
          </Small>
          <Medium>
            <SlickSlider { ...settingsMedium }>{ contentComponents }</SlickSlider>
          </Medium>
          <Large>
            <SlickSlider { ...settingsLarge }>{ contentComponents }</SlickSlider>
          </Large>
          <Desktop>
            <SlickSlider { ...settingsDesktop }>{ contentComponents }</SlickSlider>
          </Desktop>
        </section>
      )
    } else {
      return <></>
    }
  }
}
export const sliderFragment = graphql`
  fragment Slider on ContentfulSlider {
    title
    heading
    sliderSize
    startDate
    endDate
    viewAllLink {
      ...Link
    }
    slides {
      __typename
      ...ProductTile
      ...CategoryTile
      ...CollectionTile
      ...Coupon
    }
    contentful_id
  }
`
