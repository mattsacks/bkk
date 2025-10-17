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
  }
  // Redirects handled in middleware to avoid hydration mismatch
};
