const viewGenerator = require('./plop-templates/view/prompt')
const tableViewGenerator = require('./plop-templates/table-view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const storeGenerator = require('./plop-templates/store/prompt')
const pageRouterViewGenerator = require('./plop-templates/page-router-view/prompt')

module.exports = function(plop) {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('page-router-view', pageRouterViewGenerator)
  plop.setGenerator('table-view', tableViewGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('store', storeGenerator)
}
