<<<<<<< HEAD
const merge = require('webpack-merge').merge
=======
const merge = require('webpack-merge');
>>>>>>> f1ffc2bf00d9682f8b6f2eef41d63b7e8508b5e3
const baseWebpackConfig = require('./webpack.base.conf.js');

const buildWebpackConfig = merge(baseWebpackConfig, {
	mode: 'production',
	plugins: []
});

module.exports = new Promise((resolve, reject) => {
	resolve(buildWebpackConfig);
})