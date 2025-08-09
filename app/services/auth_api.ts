import axios from "axios";

const base_Url = 'https://upskilling-egypt.com:3005/api/auth';

const AxiosInstance = axios.create({
    baseURL: base_Url,

    headers: {
     Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',

       
    },
});

export const LOGIN_URL = `/login`;
export const REGISTER_URL = `/register`;
export const CHANGE_PASSWORD_URL = `/change-password`;
export const FORGET_PASSWORD_URL = `/forget-password`;
export const RESET_PASSWORD_URL = `/reset-password`;
export const LOGOUT_URL = `/logout`;

export default AxiosInstance;
