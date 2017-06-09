var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './bundleEntry.js',
  output: { path: __dirname, filename: '/static/bundle.js' },
  module: { 
		loaders: [
			{
			test: /\.jsx?$/,         // Match both .js and .jsx files
			exclude: /node_modules/, 
			loader: "babel", 
			query:
				  {
					presets:['es2015', 'react']
				  }
			}
		]
	},
};
