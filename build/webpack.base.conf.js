let path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


//configuration file

const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	assets: 'assets/',
}



module.exports = {

	externals: {
		paths: PATHS
	},

	entry: {
		app: `${PATHS.src}/index.js`,
<<<<<<< HEAD
=======
		// lk: `${PATHS.src}/lk.js`
>>>>>>> f1ffc2bf00d9682f8b6f2eef41d63b7e8508b5e3

	},
	output: {
		path: PATHS.dist,
		filename: `${PATHS.assets}js/[name].[hash].js`,
<<<<<<< HEAD
=======
		// publicPath: '/'
>>>>>>> f1ffc2bf00d9682f8b6f2eef41d63b7e8508b5e3
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					enforce: true
				}
			}
		}
	},
	
	module: {
		 rules: [{
		      test: /\.js$/,
		      loader: 'babel-loader',
		      exclude: '/node_modules/'
		    },

		    {
		      test: /\.(png|jpg|gif|svg)$/,
		      loader: 'file-loader',
		      options: {
		      	name: '[name].[ext]'
		      }
		    },

			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			},

		     {
		      test: /\.scss$/,
		      use: [
		        'style-loader',
		        MiniCssExtractPlugin.loader,
		        {
		          loader: 'css-loader',
		          options: { sourceMap: true }
		        }, {
		          loader: 'postcss-loader',
		          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
		        }, {
		          loader: 'sass-loader',
		          options: { sourceMap: true }
		        }
		      ]
		    }, {
		      test: /\.css$/,
		      use: [
		        'style-loader',
		        MiniCssExtractPlugin.loader,
		        {
		          loader: 'css-loader',
		          options: { sourceMap: true }
		        }, {
		          loader: 'postcss-loader',
		          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
		        }
		      ]
			}
			
		]
	},

	plugins: [
	    new MiniCssExtractPlugin({
	      // Options similar to the same options in webpackOptions.output
	      // both options are optional
	      filename: `${PATHS.assets}css/[name].[hash].css`,
	      chunkFilename: '[id].css',
	    }),

	    new HtmlWebpackPlugin({
	    	template: './src/index.html',
	    	filename: 'index.html',
	    	inject: false
	    }),

	    new CopyWebpackPlugin([
	    	{
	    		from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`
	    	},
	    	{
	    		from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`
	    	},
	    	{
	    		from: `${PATHS.src}/static`, to: ''
	    	}
	    	
    	])
	]
<<<<<<< HEAD
}
=======
}

// module.exports = (env, options) => {
// 	// let production = options.mode === 'production';

// 	// conf.devtool = production
// 	// 				? 'source-map' // or 'false' that nobody can see the sorce-map of .js file in production
// 	// 				: 'eval-sourcemap';
// 	return conf  
// };
>>>>>>> f1ffc2bf00d9682f8b6f2eef41d63b7e8508b5e3
