module.exports = {
  headers() {
    return [
      {
        source: "/assets/VT323.ttf",
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
        source: "/((?!login$|assets/).*)",
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
