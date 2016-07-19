var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require('../../webpack-config-maker')({
  hot: true,
  devtool: 'eval',
  debug: true,
});

Object.assign(config, {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    config.entry
  ],
  plugins: config.plugins.concat(new webpack.HotModuleReplacementPlugin()),
});

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,

  publicPath: config.output.publicPath,
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true }
});

module.exports = server;
// server.close();
