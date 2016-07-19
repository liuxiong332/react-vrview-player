var webpack = require("webpack");
var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var loadersByExtension = require("./config/loadersByExtension");

module.exports = function(options) {
  options = options || {};
  var filename = options.longTermCaching ? "bundle.[hash].js" : "bundle.js";
  var entry = './src/client/app';
  var output = {
    path: path.resolve(__dirname, './dist'),
    filename: filename,
    publicPath: "/static/",
  };
  var plugins = [];
  var cssName = options.longTermCaching ? "[name].[contenthash].css" : "[name].css";
  var extractSCSS = new ExtractTextPlugin(cssName);

  if (options.minimize) {
    plugins.push(
      new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
			}),
      extractSCSS,
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compressor: {
					warnings: false
				}
			}),
			new webpack.NoErrorsPlugin()
		);
  } else {
    plugins.push(
      new webpack.DefinePlugin({
        "__DEV__": true,
      })
    );
  }

  if (options.longTermCaching) {
    // output the assets map to the dist/webpack-assets.json
    plugins.push(new AssetsPlugin({
      path: './dist',
    }));
  }

  var  scssLoaders = options.minimize ? extractSCSS.extract(['css', 'sass']) :
    ["style", "css?sourceMap", "sass?sourceMap"];

  var loaders = {
    'js': {
      include: path.join(__dirname, 'src'),
      loaders: options.hot ? ['react-hot', 'babel-loader'] : ['babel-loader'],
    },
    'scss': scssLoaders,
    "png|jpg|jpeg|gif|svg": options.minimize ? "url-loader?limit=10000" : "url-loader",
    "woff|woff2": "url-loader?limit=100000",
		"ttf|eot": "file-loader",
  };

  return {
    entry: entry,
    output: output,
    module: {
      loaders: loadersByExtension(loaders),
    },
    plugins: plugins,
    devtool: options.devtool,
    debug: options.debug,
  }
};
