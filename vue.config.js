const defaultSettings = require("./src/settings.js");

const name = defaultSettings.title || "Material Ball";

module.exports = {
  publicPath: "/materialball/",
  configureWebpack: {
    name
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
