const defaultSettings = require("./src/settings.js");

const name = defaultSettings.title || "Material Ball";

module.exports = {
  productionSourceMap: true,
  publicPath: "/materialball/",
  configureWebpack: {
    name,
    devtool: "source-map"
  }
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },
};
