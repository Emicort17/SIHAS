import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = "http://192.168.0.9:8000";

const AxiosClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

const AxiosFormClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

AxiosClient.interceptors.request.use(async (request) => {
    const userData = await AsyncStorage.getItem('userData');
    const token = userData ? JSON.parse(userData).token : null;

    if (token) {
        request.headers["Authorization"] = `Bearer ${token}`;
    }

    request.headers["Accept"] = "application/json";
    request.headers["Content-Type"] = "application/json";
    return request;
});

AxiosFormClient.interceptors.request.use((request) => {
    request.headers["Accept"] = "application/json";
    return request;
});

const AxiosFileClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

AxiosFileClient.interceptors.request.use(async (request) => {
    const userData = await AsyncStorage.getItem('userData');
    const token = userData ? JSON.parse(userData).token : null;
    if (token) request.headers["Authorization"] = `Bearer ${token}`;
    request.headers["Accept"] = "application/pdf"; 
    return request;
});



const responseHandler = (res) => Promise.resolve(res.data);
const errorHandler = (err) => {
    if (err.response?.status === 401) {
        console.error("Redirigiendo a login...");
    }
    return Promise.reject(err);
};




AxiosClient.interceptors.response.use(responseHandler, errorHandler);
AxiosFormClient.interceptors.response.use(responseHandler, errorHandler);

export { AxiosClient, AxiosFormClient, AxiosFileClient };
