import React from 'react'
import renderer from 'react-test-renderer'
import ProductIncludesSlider from './index'

describe('ProductIncludesSlider', () => {
  const testProps = {
    items_in_room: [
      {
        sku: '15697064',
        quantity: 1,
        dimensions: "68.5'w x 33.5'd x 40'h",
        image:
          'https://images.rtg-dev.com/cindy-crawford-home-gianna-gray-leather-loveseat_15697064_image-item?cache-id=67eb9144043a65cb6decf007bc83c039',
        generic_name: 'stationary loveseat',
        title: 'Cindy Crawford Home Gianna Gray Leather Loveseat',
      },
      {
        sku: '15797066',
        quantity: 1,
        dimensions: "44.5'w x 33.5'd x 40'h",
        image:
          'https://images.rtg-dev.com/cindy-crawford-home-gianna-gray-leather-glider-recliner_15797066_image-item?cache-id=55382459b39c0650a985a3124a19fbb1',
        generic_name: 'glider recliner',
        title: 'Cindy Crawford Home Gianna Gray Leather Glider Recliner',
      },
      {
        sku: '15197064',
        quantity: 1,
        dimensions: "89'w x 40'd x 40'h",
        image:
          'https://images.rtg-dev.com/cindy-crawford-home-gianna-gray-leather-reclining-sofa_15197064_image-item?cache-id=523e7638d89e935fbe79b88787a2c542',
        generic_name: 'reclining sofa',
        title: 'Cindy Crawford Home Gianna Gray Leather Reclining Sofa',
      },
    ],
    heading: 'test heading',
  }

  it('renders correctly with items in room', () => {
    const tree = renderer.create(<ProductIncludesSlider { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
