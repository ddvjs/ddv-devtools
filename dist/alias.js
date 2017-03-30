// shared alias for all shells
const path = require('path')

module.exports = {
  popups: path.resolve(__dirname, '../lib/popups'),
  content: path.resolve(__dirname, '../lib/content'),
  devtools: path.resolve(__dirname, '../lib/devtools'),
  ddvtools: path.resolve(__dirname, '../lib/ddvtools'),
  ddvaction: path.resolve(__dirname, '../lib/ddvaction'),
  background: path.resolve(__dirname, '../lib/background'),
  backgroundDevtools: path.resolve(__dirname, '../lib/backgroundDevtools')
}
