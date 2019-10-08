const path = require(`path`)
const stringHelper = require('../helpers/string-helper')

exports.addPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const { data } = await graphql(`
    {
      allContentfulStore {
        edges {
          node {
            id
            storeNumber
            seo {
              id
              pageTitle
              pageHeading
              canonical
              metaRobots
              metaDescription {
                metaDescription
              }
              jsonLdSchema {
                jsonLdSchema
              }
              contentful_id
            }
            storeName
            storeType
            storeImage {
              file {
                url
                fileName
                contentType
              }
            }
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
            description {
              childMarkdownRemark {
                html
              }
            }
            directions {
              childMarkdownRemark {
                html
              }
            }
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
            faqs {
              markdown {
                childMarkdownRemark {
                  html
                }
              }
            }
            specialClosings {
              markdown {
                childMarkdownRemark {
                  html
                }
              }
            }
          }
        }
      }
    }
  `)
  if (data) {
    console.log('\n\x1b[32msuccess\x1b[0m creating stores page')
    let stores = []
    for (page of data.allContentfulStore.edges) {
      if (page.node.storeNumber !== 9999999) {
        stores.push(page.node)
      }
    }
    stores = getData(stores)
    const storesPage = {
      path: '/stores',
      component: path.resolve(`./src/templates/stores.jsx`),
      context: {
        stores: stores,
      },
    }
    createPage(storesPage)
    console.log('\n\x1b[32msuccess\x1b[0m creating individual store pages')
    for (page of data.allContentfulStore.edges) {
      let store = page.node
      if (store.storeNumber !== 9999999) {
        let nodePath
        if (store.storeName) {
          nodePath = `/stores/${ stringHelper.slugify(expandState(store.state).toLowerCase()) }/${ stringHelper.slugify(
            store.city.toLowerCase()
          ) }-${ stringHelper.slugify(store.storeName.toLowerCase()) }-${ stringHelper.slugify(
            store.storeType.toLowerCase()
          ) }-${ store.storeNumber }`
        } else {
          nodePath = `/stores/${ stringHelper.slugify(expandState(store.state).toLowerCase()) }/${ stringHelper.slugify(
            store.city.toLowerCase()
          ) }-${ stringHelper.slugify(store.storeType.toLowerCase()) }-${ store.storeNumber }`
        }
        const storePage = {
          path: nodePath,
          component: path.resolve(`./src/templates/store.jsx`),
          context: {
            store: store,
          },
        }
        createPage(storePage)
      }
    }
  }
}

const getData = stores => {
  let loadOrder = ['PR'],
    abbrevStates = [],
    states = [],
    territory = stores.filter(tr => {
      return loadOrder.includes(tr.state)
    }),
    mainland = stores.filter(st => {
      return !loadOrder.includes(st.state)
    })

  for (let i = 0, n = mainland.length; i < n; i++) {
    if (!abbrevStates.includes(mainland[i].state)) {
      abbrevStates.push(mainland[i].state)
    }
  }
  abbrevStates.sort()
  abbrevStates = abbrevStates.concat(loadOrder)

  for (let i = 0, n = abbrevStates.length; i < n; i++) {
    states.push(expandState(abbrevStates[i]))
  }

  const alpha = obj => {
    obj.sort((a, b) => {
      if (a.city < b.city) {
        return -1
      }
      if (a.city > b.city) {
        return 1
      }
      return 0
    })
    return obj
  }
  let list = {
    stores: alpha(mainland).concat(alpha(territory)),
    states: states,
    abbrevStates: abbrevStates,
  }
  return list
}

const expandState = state => {
  for (let i = 0; i < states.length; i++) {
    if (states[i][1] === state) {
      return states[i][0]
    }
  }
}

const states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['District Of Columbia', 'DC'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Puerto Rico', 'PR'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
]
