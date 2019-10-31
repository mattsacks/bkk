const path = require("path");
const withSass = require("@zeit/next-sass");

const webpackConfig = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]"
  },
  env: {
    MATHIS_API: process.env.MATHIS_API
  },
  webpack(config) {
    config.resolve.modules = [path.resolve(__dirname), "node_modules"];
    return config;
  }
};

module.exports = withSass(webpackConfig);
