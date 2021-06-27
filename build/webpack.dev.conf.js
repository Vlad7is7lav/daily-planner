const webpack = require('webpack');

const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf.js');
const devWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',

	devtool: 'cheap-module-eval-source-map',
	devServer: {
		proxy: {
			'/': 'http://localhost:3003'
		  },
		contentBase: baseWebpackConfig.externals.paths.dist,
		port: 3000,
		overlay: {
			warnings: true, //if Warnings, information is shown immediately in the window of the browser instead of webpage
			errors: true //if Error, information is shown immediately in the window of the browser instead of webpage
		} 
	},
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: "[file].map"
		}),
	]
});

module.exports = new Promise((resolve, reject) => {
	resolve(devWebpackConfig);
})


