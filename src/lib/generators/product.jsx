const path = require(`path`)
const slugify = require(`../helpers/string-helper`)

exports.addPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // const { data } = await graphql(`
  //   {
  //     allS3Product {
  //       totalCount
  //       edges {
  //         node {
  //           sku
  //           title
  //           internal {
  //             content
  //           }
  //         }
  //       }
  //     }
  //     contentfulProductAdditionalContent(contentful_id: { eq: "6CKcNwznwIg22wGWOykQM6" }) {
  //       name
  //       bannerPlacementMiddle {
  //         ... on ContentfulBanner {
  //           title
  //           startDate
  //           endDate
  //           displayContent
  //           contentText {
  //             childMarkdownRemark {
  //               html
  //             }
  //           }
  //           contentHorizontalRuleColor
  //           textPosition
  //           contentPosition
  //           containerSize
  //           contentLinkColor
  //           link {
  //             id
  //             text
  //             displayText
  //             textColor
  //             internalUrl {
  //               url
  //             }
  //             slug
  //             url
  //             altDesc
  //             title
  //             type
  //           }
  //           contentLink {
  //             id
  //             text
  //             displayText
  //             textColor
  //             internalUrl {
  //               url
  //             }
  //             slug
  //             url
  //             altDesc
  //             title
  //             type
  //           }
  //           buttons {
  //             __typename
  //             ... on ContentfulButton {
  //               name
  //               link {
  //                 id
  //                 text
  //                 displayText
  //                 textColor
  //                 internalUrl {
  //                   url
  //                 }
  //                 slug
  //                 url
  //                 altDesc
  //                 title
  //                 type
  //               }
  //               icon {
  //                 id
  //                 sizes {
  //                   srcSet
  //                   src
  //                   sizes
  //                 }
  //                 file {
  //                   url
  //                   fileName
  //                   contentType
  //                 }
  //                 resolutions {
  //                   width
  //                   height
  //                 }
  //               }
  //               iconActive {
  //                 id
  //                 sizes {
  //                   srcSet
  //                   src
  //                   sizes
  //                 }
  //                 file {
  //                   url
  //                   fileName
  //                   contentType
  //                 }
  //                 resolutions {
  //                   width
  //                   height
  //                 }
  //               }
  //               iconPosition
  //               displayIcon
  //               text
  //               displayBorder
  //               displayText
  //               textColor
  //               borderColor
  //               backgroundColor
  //               contentful_id
  //             }
  //           }
  //           imageAltText
  //           desktopBackgroundImage {
  //             id
  //             sizes {
  //               srcSet
  //               src
  //               sizes
  //             }
  //             file {
  //               url
  //               fileName
  //               contentType
  //             }
  //             resolutions {
  //               width
  //               height
  //             }
  //           }
  //           backgroundColor
  //           mobileImage {
  //             id
  //             sizes {
  //               srcSet
  //               src
  //               sizes
  //             }
  //             file {
  //               url
  //               fileName
  //               contentType
  //             }
  //             resolutions {
  //               width
  //               height
  //             }
  //           }
  //           desktopImage {
  //             id
  //             sizes {
  //               srcSet
  //               src
  //               sizes
  //             }
  //             file {
  //               url
  //               fileName
  //               contentType
  //             }
  //             resolutions {
  //               width
  //               height
  //             }
  //           }
  //           contentful_id
  //         }
  //       }
  //       bannerFinancingOptions {
  //         ... on ContentfulBanner {
  //           title
  //           startDate
  //           endDate
  //           displayContent
  //           contentText {
  //             childMarkdownRemark {
  //               html
  //             }
  //           }
  //           contentHorizontalRuleColor
  //           textPosition
  //           contentPosition
  //           containerSize
  //           contentLinkColor
  //           link {
  //             id
  //             text
  //             displayText
  //             textColor
  //             internalUrl {
  //               url
  //             }
  //             slug
  //             url
  //             altDesc
  //             title
  //             type
  //           }
  //           contentLink {
  //             id
  //             text
  //             displayText
  //             textColor
  //             internalUrl {
  //               url
  //             }
  //             slug
  //             url
  //             altDesc
  //             title
  //             type
  //           }
  //           buttons {
  //             __typename
  //             ... on ContentfulButton {
  //               name
  //               link {
  //                 id
  //                 text
  //                 displayText
  //                 textColor
  //                 internalUrl {
  //                   url
  //                 }
  //                 slug
  //                 url
  //                 altDesc
  //                 title
  //                 type
  //               }
  //               icon {
  //                 id
  //                 sizes {
  //                   srcSet
  //                   src
  //                   sizes
  //                 }
  //                 file {
  //                   url
  //                   fileName
  //                   contentType
  //                 }
  //                 resolutions {
  //                   width
  //                   height
  //                 }
  //               }
  //               iconActive {
  //                 id
  //                 sizes {
  //                   srcSet
  //                   src
  //                   sizes
  //                 }
  //                 file {
  //                   url
  //                   fileName
  //                   contentType
  //                 }
  //                 resolutions {
  //                   width
  //                   height
  //                 }
  //               }
  //               iconPosition
  //               displayIcon
  //               text
  //               displayBorder
  //               displayText
  //               textColor
  //               borderColor
  //               backgroundColor
  //               contentful_id
  //             }
  //           }
  //           imageAltText
  //           desktopBackgroundImage {
  //             id
  //             sizes {
  //               srcSet
  //               src
  //               sizes
  //             }
  //             file {
  //               url
  //               fileName
  //               contentType
  //             }
  //             resolutions {
  //               width
  //               height
  //             }
  //           }
  //           backgroundColor
  //           mobileImage {
  //             id
  //             sizes {
  //               srcSet
  //               src
  //               sizes
  //             }
  //             file {
  //               url
  //               fileName
  //               contentType
  //             }
  //             resolutions {
  //               width
  //               height
  //             }
  //           }
  //           desktopImage {
  //             id
  //             sizes {
  //               srcSet
  //               src
  //               sizes
  //             }
  //             file {
  //               url
  //               fileName
  //               contentType
  //             }
  //             resolutions {
  //               width
  //               height
  //             }
  //           }
  //           contentful_id
  //         }
  //       }
  //       contentful_id
  //       __typename
  //     }
  //   }
  // `)
  // if (data) {
  //   console.log('\n\x1b[32msuccess\x1b[0m creating s3 product pages')
  //   for (page of data.allS3Product.edges) {
  //     let product = page.node
  //     const nodePath = `/furniture/product/${ slugify(product.title.toLowerCase()) }/${ product.sku.toLowerCase() }`
  //     const productPage = {
  //       path: nodePath,
  //       component: path.resolve(`./src/templates/product.jsx`),
  //       context: {
  //         product: product.internal.content,
  //         banners: data.contentfulProductAdditionalContent,
  //       },
  //     }
  //     createPage(productPage)
  //   }
  //   console.log('\x1b[32msuccess\x1b[0m creating dynamic product page')
  //   const productPage = {
  //     path: `/furniture/product`,
  //     component: path.resolve(`./src/templates/product.jsx`),
  //     context: {
  //       banners: data.contentfulProductAdditionalContent,
  //     },
  //     matchPath: `/furniture/product/*`,
  //   }
  //   createPage(productPage)
  // } else {
  const { data } = await graphql(`
    {
      contentfulProductAdditionalContent(contentful_id: { eq: "6CKcNwznwIg22wGWOykQM6" }) {
        name
        bannerPlacementMiddle {
          ... on ContentfulBanner {
            title
            startDate
            endDate
            displayContent
            contentText {
              childMarkdownRemark {
                html
              }
            }
            contentHorizontalRuleColor
            textPosition
            contentPosition
            containerSize
            contentLinkColor
            link {
              id
              text
              displayText
              textColor
              internalUrl {
                url
              }
              slug
              url
              altDesc
              title
              type
            }
            contentLink {
              id
              text
              displayText
              textColor
              internalUrl {
                url
              }
              slug
              url
              altDesc
              title
              type
            }
            buttons {
              __typename
              ... on ContentfulButton {
                name
                link {
                  id
                  text
                  displayText
                  textColor
                  internalUrl {
                    url
                  }
                  slug
                  url
                  altDesc
                  title
                  type
                }
                icon {
                  id
                  sizes {
                    srcSet
                    src
                    sizes
                  }
                  file {
                    url
                    fileName
                    contentType
                  }
                  resolutions {
                    width
                    height
                  }
                }
                iconActive {
                  id
                  sizes {
                    srcSet
                    src
                    sizes
                  }
                  file {
                    url
                    fileName
                    contentType
                  }
                  resolutions {
                    width
                    height
                  }
                }
                iconPosition
                displayIcon
                text
                displayBorder
                displayText
                textColor
                borderColor
                backgroundColor
                contentful_id
              }
            }
            imageAltText
            desktopBackgroundImage {
              id
              sizes {
                srcSet
                src
                sizes
              }
              file {
                url
                fileName
                contentType
              }
              resolutions {
                width
                height
              }
            }
            backgroundColor
            mobileImage {
              id
              sizes {
                srcSet
                src
                sizes
              }
              file {
                url
                fileName
                contentType
              }
              resolutions {
                width
                height
              }
            }
            desktopImage {
              id
              sizes {
                srcSet
                src
                sizes
              }
              file {
                url
                fileName
                contentType
              }
              resolutions {
                width
                height
              }
            }
            contentful_id
          }
        }
        bannerFinancingOptions {
          ... on ContentfulBanner {
            title
            startDate
            endDate
            displayContent
            contentText {
              childMarkdownRemark {
                html
              }
            }
            contentHorizontalRuleColor
            textPosition
            contentPosition
            containerSize
            contentLinkColor
            link {
              id
              text
              displayText
              textColor
              internalUrl {
                url
              }
              slug
              url
              altDesc
              title
              type
            }
            contentLink {
              id
              text
              displayText
              textColor
              internalUrl {
                url
              }
              slug
              url
              altDesc
              title
              type
            }
            buttons {
              __typename
              ... on ContentfulButton {
                name
                link {
                  id
                  text
                  displayText
                  textColor
                  internalUrl {
                    url
                  }
                  slug
                  url
                  altDesc
                  title
                  type
                }
                icon {
                  id
                  sizes {
                    srcSet
                    src
                    sizes
                  }
                  file {
                    url
                    fileName
                    contentType
                  }
                  resolutions {
                    width
                    height
                  }
                }
                iconActive {
                  id
                  sizes {
                    srcSet
                    src
                    sizes
                  }
                  file {
                    url
                    fileName
                    contentType
                  }
                  resolutions {
                    width
                    height
                  }
                }
                iconPosition
                displayIcon
                text
                displayBorder
                displayText
                textColor
                borderColor
                backgroundColor
                contentful_id
              }
            }
            imageAltText
            desktopBackgroundImage {
              id
              sizes {
                srcSet
                src
                sizes
              }
              file {
                url
                fileName
                contentType
              }
              resolutions {
                width
                height
              }
            }
            backgroundColor
            mobileImage {
              id
              sizes {
                srcSet
                src
                sizes
              }
              file {
                url
                fileName
                contentType
              }
              resolutions {
                width
                height
              }
            }
            desktopImage {
              id
              sizes {
                srcSet
                src
                sizes
              }
              file {
                url
                fileName
                contentType
              }
              resolutions {
                width
                height
              }
            }
            contentful_id
          }
        }
        contentful_id
        __typename
      }
    }
  `)
  console.log('\n\x1b[32msuccess\x1b[0m creating dynamic product page')
  if (!data) {
    console.log('--- Contentful Product Additional Content has failed. Entry ID: 6CKcNwznwIg22wGWOykQM6 ---')
  }
  const productPage = {
    path: `/furniture/product`,
    component: path.resolve(`./src/templates/product.jsx`),
    context: {
      banners: data ? data.contentfulProductAdditionalContent : {},
    },
    matchPath: `/furniture/product/*`,
  }
  createPage(productPage)
  // }
}
