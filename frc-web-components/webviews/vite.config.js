const path = require('path');

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/pages/app.js'),
      name: 'components'
    }
  }
};