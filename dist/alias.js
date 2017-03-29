// shared alias for all shells
const path = require('path')

module.exports = {
  popups: path.resolve(__dirname, '../lib/popups'),
  devtools: path.resolve(__dirname, '../lib/devtools'),
  ddvtools: path.resolve(__dirname, '../lib/ddvtools'),
  ddvaction: path.resolve(__dirname, '../lib/ddvaction'),
  background: path.resolve(__dirname, '../lib/background'),
  backgroundDevtools: path.resolve(__dirname, '../lib/backgroundDevtools')
  // src: path.resolve(__dirname, '../src'),
  // views: path.resolve(__dirname, '../src/devtools/views'),
  // components: path.resolve(__dirname, '../src/devtools/components')
}
