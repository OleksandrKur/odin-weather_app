const {merge} = require("webpack-merge");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
});