const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		'index': './js/index.js',
		'index.min': './js/index.js',
		'animating-svg-path-data-metamorpher-velocityjs': './js/articles/animating-svg-path-data-metamorpher-velocityjs/index.js',
		'css-custom-properties-cleaner-responsive-design-code': './js/articles/css-custom-properties-cleaner-responsive-design-code.js'
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