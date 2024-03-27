module.exports = {
  headers() {
    return [
      {
        // TODO: Move public assets under a folder for easier wildcard
        source: "/VT323.ttf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/((?!login$).*)",
        missing: [
          {
            type: "cookie",
            key: "mathis_user"
          }
        ],
        destination: "/login",
        permanent: false
      },
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key: "mathis_user"
          }
        ],
        destination: "/",
        permanent: false
      }
    ];
  }
};
