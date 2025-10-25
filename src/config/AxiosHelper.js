import axios from 'axios';
export const baseURL='https://chat-app-orpin-eight-99.vercel.app';
 
export const httpClient =axios.create({
    baseURL:baseURL,
});