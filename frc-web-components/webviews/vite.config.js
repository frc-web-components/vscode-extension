const path = require('path');


module.exports = {
  build: {
    // lib: {
    //   entry: path.resolve(__dirname, 'src/pages/app.js'),
    //   name: 'components'
    // }
    rollupOptions: {
      input: {
        'app': path.resolve(__dirname, 'src/pages/app.js')
      },
      output: [
        {
          entryFileNames: ({ facadeModuleId }) => 
            `${path.basename(facadeModuleId)}`,
          format: 'esm',
          dir: path.resolve(__dirname, 'lib')
        },
      ]
    }
  }
};