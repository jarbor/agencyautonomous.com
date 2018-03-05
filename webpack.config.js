const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		'index': './js/index.js',
		'index.min': './js/index.js',
		'animating-svg-path-data-metamorpher-velocityjs': './js/articles/animating-svg-path-data-metamorpher-velocityjs/index.js',
		'clean-responsive-code-css-variables-custom-poperties': './js/articles/clean-responsive-code-css-variables-custom-poperties.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'es5')
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}]
	},
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};