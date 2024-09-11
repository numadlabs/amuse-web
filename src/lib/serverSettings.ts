import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const BACKEND_URL = `${publicRuntimeConfig.apiUrl}/api`;
const SOCKET_URL = `${publicRuntimeConfig.apiUrl}`;

const RESTAURANT_PIC_LINK = `${publicRuntimeConfig.cdnUrl}/restaurant`;
const PROFILE_PIC_LINK = `${publicRuntimeConfig.cdnUrl}/user`;
console.log("🚀 ~ BACKEND_URL:", BACKEND_URL);

const SERVER_SETTINGS = {
  BACKEND_URL,
  PROFILE_PIC_LINK,
  RESTAURANT_PIC_LINK,
  SOCKET_URL,
};

export default SERVER_SETTINGS;
