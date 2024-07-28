/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/fast-api/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : "/fast-api/openapi.json",
      },
      {
        source: "/fast-api/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "/fast-api/docs",
      },
      {
        source: "/fast-api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/fast-api/:path*"
            : "/fast-api/",
      },
    ];
  },
};

export default nextConfig;
