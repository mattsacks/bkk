module.exports = {
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
