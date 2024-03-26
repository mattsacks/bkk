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
      }
    ];
  }
};
