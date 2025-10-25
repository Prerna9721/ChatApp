import axios from 'axios';
export const baseURL="chatbackend-production-f10d.up.railway.app";

export const httpClient =axios.create({
    baseURL:baseURL,
});