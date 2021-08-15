const path = require('path');


module.exports = {
  build: {
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