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

  module: { loaders: [{
    test: /\.styl(us)?$/,
    loader: OhPack.loaders.stylus
  },{
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      presets: ['react','es2015']
    }
  }]},

  plugins: [ new OhPack () ],

  stylus: { use:[SMixer()] }

};
