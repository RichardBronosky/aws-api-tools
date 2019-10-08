import React from 'react'
import Helmet from 'react-helmet'

import icon from '../../assets/images/favicon/favicon.ico'
import icon16 from '../../assets/images/favicon/favicon-16x16.png'
import icon32 from '../../assets/images/favicon/favicon-32x32.png'
import icon96 from '../../assets/images/favicon/favicon-96x96.png'
import icon160 from '../../assets/images/favicon/favicon-160x160.png'
import icon192 from '../../assets/images/favicon/favicon-192x192.png'

import appleIcon60 from '../../assets/images/favicon/apple-touch-icon-60x60.png'
import appleIcon72 from '../../assets/images/favicon/apple-touch-icon-72x72.png'
import appleIcon76 from '../../assets/images/favicon/apple-touch-icon-76x76.png'
import appleIcon114 from '../../assets/images/favicon/apple-touch-icon-114x114.png'
import appleIcon120 from '../../assets/images/favicon/apple-touch-icon-120x120.png'
import appleIcon144 from '../../assets/images/favicon/apple-touch-icon-144x144.png'
import appleIcon152 from '../../assets/images/favicon/apple-touch-icon-152x152.png'
import appleIcon180 from '../../assets/images/favicon/apple-touch-icon-180x180.png'

import msTile from '../../assets/images/favicon/mstile-144x144.png'

export default () => (
  <Helmet
    link={ [
      { rel: 'shortcut icon', type: 'image/png', href: icon },
      { rel: 'icon', type: 'image/png', href: icon192, sizes: '192x192' },
      { rel: 'icon', type: 'image/png', href: icon160, sizes: '160x160' },
      { rel: 'icon', type: 'image/png', href: icon96, sizes: '96x96' },
      { rel: 'icon', type: 'image/png', href: icon32, sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: icon16, sizes: '16x16' },
      { rel: 'apple-touch-icon', href: appleIcon180, sizes: '180x180' },
      { rel: 'apple-touch-icon', href: appleIcon152, sizes: '152x152' },
      { rel: 'apple-touch-icon', href: appleIcon144, sizes: '144x144' },
      { rel: 'apple-touch-icon', href: appleIcon120, sizes: '120x120' },
      { rel: 'apple-touch-icon', href: appleIcon114, sizes: '114x114' },
      { rel: 'apple-touch-icon', href: appleIcon76, sizes: '76x76' },
      { rel: 'apple-touch-icon', href: appleIcon72, sizes: '72x72' },
      { rel: 'apple-touch-icon', href: appleIcon60, sizes: '60x60' },
    ] }
    meta={ [
      {
        name: 'msapplication-TileColor',
        content: '#da532c',
      },
      {
        name: 'msapplication-TileImage',
        content: msTile,
      },
      {
        name: 'theme-color',
        content: '#00529f',
      },
    ] }
  />
)
