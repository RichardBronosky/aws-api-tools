module.exports = function (migration) {
  // Create a new category field in the blog post content type.
  const page = migration.createContentType('page', {
    name: 'Page',
    description: 'A page on the site with a url and content',
    displayField: 'title'
  });
  page.createField('content')
    .name('Content')
    .type('Array')
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "banner",
            "categorySection",
            "categorySlider",
            "image",
            "productSlider",
            "slider",
            "text"
          ]
        }
      ]
    })

    page.createField('title')
      .name('title')
      .type('Symbol')

    page.createField('route')
      .name('route')
      .type('Symbol')
      .required(true)
}
