const fs = require('fs')
const pify = require('pify')
const publicPath = `./public`

exports.writeFile = pify(fs.writeFile)
exports.renameFile = pify(fs.rename)

exports.runQuery = async (graphql, query) => {
  graphql(query).then(r => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `))
    }
    return r.data
  })
}

exports.sitemapIndex = async (siteUrl, urls, fileName) => {
  const savePath = `${ publicPath }/${ fileName }.xml`
  let xml = []
  xml.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  xml.push(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`)
  xml.push(`<sitemap>`)
  urls.map(u => xml.push(`<loc>${ siteUrl + u }</loc>`))
  xml.push(`</sitemap>`)
  xml.push(`</sitemapindex>`)
  return await this.writeFile(savePath, xml.join('\n'))
}

exports.sitemapUrlSet = async (siteUrl, urls, fileName, priority)  => {
  const savePath = `${ publicPath }/${ fileName }.xml`
  let xml = []
  xml.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  xml.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`)
  urls.map(u => xml.push(`
    <url>
      <loc>${ siteUrl + u }</loc>
      <changefreq>daily</changefreq>
      <priority>${ priority ? priority : '0.7' }</priority>
    </url>
  `))
  xml.push(`</urlset>`)
  return await this.writeFile(savePath, xml.join('\n'))
}
