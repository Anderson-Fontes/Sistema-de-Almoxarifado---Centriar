import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api' // Ajuste se a sua porta for diferente
});

// Interceptador: Toda vez que o React for falar com o Banco, ele anexa o Token!
api.interceptors.request.use(async config => {
    const token = localStorage.getItem('@Centriar:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;