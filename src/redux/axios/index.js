import axios from "axios";
import { apiBaseUrl } from "../../settings";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
