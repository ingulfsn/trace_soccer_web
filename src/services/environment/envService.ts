export const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const env = {
  backendBaseURL: process.env.REACT_APP_BACKEND_BASE_URL ?? "",
};
