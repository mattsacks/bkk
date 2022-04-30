/* eslint-env node */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.build" });
}

const path = require("path");
const withSourceMaps = require("@zeit/next-source-maps");

const webpackConfig = {
  // cssModules: true,
  // cssLoaderOptions: {
  //   importLoaders: 1,
  //   localIdentName: "[local]___[hash:base64:5]"
  // },
  env: {
    BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
    MATHIS_API: process.env.MATHIS_API,
    GENIUS_API_KEY: process.env.GENIUS_API_KEY
  }
};

module.exports = withSourceMaps(webpackConfig);
