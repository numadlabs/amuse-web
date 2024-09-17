/** @type {import('next').NextConfig} */

const getBackendUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://api.amusebouche.io";
  } else {
    return "https://amuse-backend-staging-478fc2297634.herokuapp.com";
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
        pathname: "/**",
      },
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  publicRuntimeConfig: {
    cdnUrl: "https://d2fovtzya8mbko.cloudfront.net",
    // apiUrl: getBackendUrl(),
    apiUrl: getBackendUrl(),
  },
};

export default nextConfig;
