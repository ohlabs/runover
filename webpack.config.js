var OhPack = require('ohpack-webpack-plugin');
var SMixer = require('stylus-mixer');

module.exports = {

  entry: {
    'runover.js': './src/runover.js'
  },

  output: {
    filename: '[name]',
    path: './dist'
  },

  module: { loaders: [
    { test:/\.styl(us)?$/, loader:OhPack.loaders.stylus }
  ]},

  plugins: [ new OhPack () ],

  stylus: { use:[SMixer()] }

};
