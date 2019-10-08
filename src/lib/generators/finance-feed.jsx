const fs = require('fs')

exports.storeFile = async ({ graphql }) => {
  const { data } = await graphql(`
    {
      contentfulFinancePlansGroup(contentful_id: { eq: "1LA7NzBQHlWErLQWAHqYKD" }) {
        id
        se0 {
          name
          financeCode
          priority
          downPaymentRequired
          effectiveDate
          creditEndsDate
          termsAndConditions {
            childMarkdownRemark {
              html
            }
          }
          marketingMessage {
            markdown {
              childMarkdownRemark {
                html
              }
            }
          }
          promoMessage {
            childMarkdownRemark {
              html
            }
          }
          threshold
          numberOfMonths
          siteFriendlyLabel
          contentful_id
          __typename
        }
        fl0 {
          name
          financeCode
          priority
          downPaymentRequired
          effectiveDate
          creditEndsDate
          termsAndConditions {
            childMarkdownRemark {
              html
            }
          }
          marketingMessage {
            markdown {
              childMarkdownRemark {
                html
              }
            }
          }
          promoMessage {
            childMarkdownRemark {
              html
            }
          }
          threshold
          numberOfMonths
          siteFriendlyLabel
          contentful_id
          __typename
        }
        tx0 {
          name
          financeCode
          priority
          downPaymentRequired
          effectiveDate
          creditEndsDate
          termsAndConditions {
            childMarkdownRemark {
              html
            }
          }
          marketingMessage {
            markdown {
              childMarkdownRemark {
                html
              }
            }
          }
          promoMessage {
            childMarkdownRemark {
              html
            }
          }
          threshold
          numberOfMonths
          siteFriendlyLabel
          contentful_id
          __typename
        }
      }
    }
  `)
  if (data && data.contentfulFinancePlansGroup) {
    console.log('\n\x1b[32msuccess\x1b[0m saving finance feed from Contentful')
    const stringifiedResponse = JSON.stringify(data.contentfulFinancePlansGroup, null, 2)
    const dataDir = `${ __dirname }/data`
    const filePath = `${ dataDir }/finance-plan-feed.json`
    try {
      fs.existsSync(dataDir) || fs.mkdirSync(dataDir)
      fs.writeFileSync(filePath, stringifiedResponse)
    } catch (err) {
      console.log('error saving finance feed from Contentful')
    }
  }
}
