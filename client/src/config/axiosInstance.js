import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/`
const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;