import axios from 'axios';
import conf from '../conf/conf';

const axiosInstance = axios.create({
    baseURL: conf.backendUri,               
    withCredentials: true,                 
});

export default axiosInstance;