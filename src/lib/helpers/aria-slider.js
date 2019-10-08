import { taskDone } from './aria-announce'

export const sliderfix = (slider, type) => {
  let ele = slider

  const add = arr => {
    for (let ii = 0; ii < arr.length; ii++) {
      let anchor = arr[ii]
      anchor.setAttribute('tabindex', '-1')
      anchor.setAttribute('aria-hidden', 'true')
    }
  }

  const remove = arr => {
    for (let ii = 0; ii < arr.length; ii++) {
      let anchor = arr[ii]
      anchor.removeAttribute('tabindex')
      anchor.removeAttribute('aria-hidden')
    }
  }

  const check = () => {
    if (ele) {
      let parent = ele.current
      if (parent) {
        let slides = parent.querySelectorAll('.slick-slide')
        for (let i = 0; i < slides.length; i++) {
          let slide = slides[i]

          if (slide.classList.contains('slick-active')) {
            remove(slide.querySelectorAll('a'))
            remove(slide.querySelectorAll('button'))
          } else {
            add(slide.querySelectorAll('a'))
            add(slide.querySelectorAll('button'))
          }
        }
      }
    }
  }

  if (ele && ele.current) {
    taskDone(
      () => {
        check()
      },
      type == 'init' ? 1 : 200,
      'adjustSlides'
    )
  }
}
