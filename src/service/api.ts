import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data;
      
      let errorMessage = 'Erro na requisição';
      
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data && typeof data === 'object') {
        errorMessage = data.message || 
                      data.error || 
                      data.erro ||  
                      data.detail ||
                      (data.errors && data.errors.length > 0 ? data.errors[0].message : null) ||
                      'Erro na operação';
      }
      
      const customError = new Error(errorMessage);
      return Promise.reject(customError);
    }
    
    return Promise.reject(error);
  }
);

export default api;