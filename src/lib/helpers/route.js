import { slugGenerator } from './string-helper'

export const productUrl = (title, sku) => {
  return `/furniture/product${ slugGenerator(title, sku) }`
}
