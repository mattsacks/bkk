module.exports = {
  async redirects() {
    return [
      {
        source: "/",
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
