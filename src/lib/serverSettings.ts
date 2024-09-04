import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const BACKEND_URL = `${publicRuntimeConfig.apiUrl}/api`;
const IMAGE_CDN = publicRuntimeConfig.imageCdn;
console.log("🚀 ~ BACKEND_URL:", BACKEND_URL);

const SERVER_SETTINGS = {
  BACKEND_URL,
  IMAGE_CDN,
};

export default SERVER_SETTINGS;
