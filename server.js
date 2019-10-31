const express = require("express");
const next = require("next");
const proxyMiddleware = require("http-proxy-middleware");

const devProxy = {
  "/api": {
    target: "https://mathis-development.herokuapp.com",
    pathRewrite: { "^/api": "/api/v1" },
    changeOrigin: true
  }
};

const port = parseInt(process.env.PORT, 10) || 3000;
const isDevelopment = process.env.NODE_ENV !== "production";

const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev: isDevelopment
});

const handle = app.getRequestHandler();

let server;

app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    if (isDevelopment) {
      Object.keys(devProxy).forEach(function(context) {
        server.use(proxyMiddleware(context, devProxy[context]));
      });
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => {
      handle(req, res)
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the server");
    console.log(err);
  });
