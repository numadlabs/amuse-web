/** @type {import('next').NextConfig} */

const getBackendUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://api.amusebouche.io";
  } else if (process.env.VERCEL_ENV === "preview") {
    return "https://amuse-backend-staging-478fc2297634.herokuapp.com";
  } else {
    return "http://localhost:3001";
  }
};
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2fovtzya8mbko.cloudfront.net",
        port: "",
        pathname: "/restaurant/**",
      },
      {
        protocol: "https",
        hostname: "d2fovtzya8mbko.cloudfront.net",
        port: "",
        pathname: "/asset/**",
      },
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  publicRuntimeConfig: {
    imageCdn: "https://d2fovtzya8mbko.cloudfront.net/restaurant",
    // apiUrl: getBackendUrl(),
    apiUrl: "https://amuse-backend-staging-478fc2297634.herokuapp.com",
  },
};

export default nextConfig;
