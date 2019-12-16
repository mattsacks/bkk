console.error("NODE ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.build" });
}

const path = require("path");
const withSass = require("@zeit/next-sass");
const withSourceMaps = require("@zeit/next-source-maps");

const webpackConfig = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]"
  },
  env: {
    BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
    MATHIS_API: process.env.MATHIS_API
  },
  webpack(config) {
    config.resolve.modules = [path.resolve(__dirname), "node_modules"];
    return config;
  }
};

module.exports = withSourceMaps(withSass(webpackConfig));
