import axios from 'axios';

const SERVER_URL = "http://172.18.240.1:8080";
const AxiosClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

const AxiosFormClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: false,
});

AxiosClient.interceptors.request.use((request) => {
    request.headers["Accept"] = "application/json";
    request.headers["Content-Type"] = "application/json";
    return request;
});

AxiosFormClient.interceptors.request.use((request) => {
    request.headers["Accept"] = "application/json";
    return request;
});

const responseHandler = (res) => Promise.resolve(res.data);
const errorHandler = (err) => {
    if (err.response?.status === 401) {
        window.location.href = "/sign-in";
    }
    return Promise.reject(err);
};

AxiosClient.interceptors.response.use(responseHandler, errorHandler);
AxiosFormClient.interceptors.response.use(responseHandler, errorHandler);

export { AxiosClient, AxiosFormClient };