const path = require('path');


module.exports = {
  build: {
    rollupOptions: {
      input: {
        'no-dashboard-opened': path.resolve(__dirname, 'src/pages/no-dashboard-opened.js')
      },
      output: [
        {
          entryFileNames: ({ facadeModuleId }) => 
            `${path.basename(facadeModuleId)}`,
          format: 'esm',
          dir: path.resolve(__dirname, 'dist')
        },
      ]
    }
  }
};