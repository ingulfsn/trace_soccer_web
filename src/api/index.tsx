import axios, { AxiosRequestConfig } from "axios";
import { env } from "../services/environment/envService";

export const axiosInstance = axios.create({
  baseURL: env.backendBaseURL,
  timeout: 10000,
});

export const request = async (config: AxiosRequestConfig): Promise<any> => {
  return await axiosInstance(config);
};
