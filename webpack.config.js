var path = require('path');
var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var autoprefixer = require('autoprefixer');
var argv = require('minimist')(process.argv.slice(2));

var modules_dir = path.join(__dirname, "/node_modules");
var src_dir = path.join(__dirname, "/src");

var config = {
	devtool: "cheap-module-eval-source-map",
	context: __dirname,
	entry: {
		app: src_dir + "/App.tsx",
		vendor: [
			"react", "react-dom",
			"bootstrap", "bootstrap/dist/css/bootstrap.css", "react-bootstrap"
		]
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'app.js'
	},
	resolve: {
		extensions: ['', '.ts', '.tsx', '.js'],
	},
	module: {
		loaders: [
			{
				test: /\.(tsx|ts)$/,
				exclude: /node_modules/,
				loaders: buildDep(
					['react-hot', 'ts-loader'],
					['ts-loader']
				)
			}, {
				test: /\.less$/,
				loader: buildDep(
					"style-loader!css-loader!postcss-loader!less-loader",
					ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
				)
			}, {
				test: /\.css/,
				loader: "style-loader!css-loader"
			}, {
				test: /\.(jpe?g|png|gif)$/i,
				loader: 'url-loader?limit=5000&name=/[path][name].[ext]?[hash]'
			}, {
				test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
				loader: 'url-loader?limit=5000&name=/[path][name].[ext]?[hash]'
			}
		],
	},
	postcss: [autoprefixer],
	plugins: [
		new webpack.NoErrorsPlugin(),
		new HtmlWebpackPlugin({
			// Required
			inject: false,
			template: 'node_modules/html-webpack-template/index.ejs',

			appMountId: "application",
			file: "index.html",
			title: "Test: Ohlala demo",
			baseHref: "/"
		}),
		new ExtractTextPlugin("[name].[hash].css"),
		new webpack.ProvidePlugin({
			'$': "jquery",
			'jQuery': "jquery"
		}),
		new CopyWebpackPlugin([{
			from: src_dir + '/assets',
			to: src_dir + '/assets'
		}]),
		new webpack.optimize.CommonsChunkPlugin({
			names: buildDep(["app", "vendor"], ["app", "vendor", "manifest"]),
			filename: buildDep("[name].js", "[name].[chunkhash].js")
		}),
		/*new webpack.optimize.UglifyJsPlugin({
		 sourceMap: false,
		 mangle: false
		 })*/
	]
};

module.exports = config;

/**
 * If running in debug mode, return the 'debug' argument, else return the 'release' argument.
 */
function buildDep(debug, release) {
	return isDebug() ? debug : release;
}

function isDebug() {
	return !!argv.dev;
}