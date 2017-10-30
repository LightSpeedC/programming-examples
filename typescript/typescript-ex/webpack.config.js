// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const wait = ms => new Promise(res => setTimeout(res, ms));

module.exports = async function () {
	return {
		context: __dirname + '/src',
		entry: {main: './main'},
		output: {
			path: __dirname + '/dist',
			filename: '[name].bundle.js',
			pathinfo: true, // Include comments with information about the modules.
		},

		devServer: {
			contentBase: './dist',
			hot: true,
		},

		plugins: [
			// new CleanWebpackPlugin(['dist']),
			// new HtmlWebpackPlugin({
			//	title: 'Output Management'
			// })
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			// new UglifyJSPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
		],

		// devtool: 'source-map',
		devtool: 'inline-source-map',
		resolve: {
			modules: [
				__dirname + '/src',
				'node_modules',
			],
			extensions: ['.tsx', '.ts', '.js']
		},

		module: {
			rules: [
				{
					test: /\.tsx?$/,
					// use: [{loader: 'ts-loader'}],
					// use: ['ts-loader'],
					use: 'ts-loader',
					exclude: /node_modules/,
				},
			],
		},

		externals: [
		],
	};
};
