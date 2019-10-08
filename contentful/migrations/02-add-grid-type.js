module.exports = function (migration) {
  const grid = migration.createContentType('grid', {
    name: 'Grid',
    description: 'A container of tiles with a specific number of columns.',
    displayField: 'name'
  });
  grid.createField('content')
    .name('Content')
    .type('Array')
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "categoryTile",
            "productTile"
          ]
        }
      ]
    })

    grid.createField('name')
      .name('name')
      .type('Symbol')

    grid.createField('columnCount')
      .name('Columns')
      .type('Integer')
      .validations([
        {
          "range": {
            "min": 1,
            "max": 6
          }
        }
      ])
}
