import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance with a base URL and default headers
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token from cookies (client-side)
instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Running on the client-side
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    if (userInfo) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
  }
  return config;
}, (error) => {
  // Handle request error
  return Promise.reject(error);
});

// Function to get token for server-side usage
const getTokenFromRequest = (req) => {
  if (req && req.cookies) {
    const userInfo = req.cookies['userInfo'] ? JSON.parse(req.cookies['userInfo']) : null;
    return userInfo ? userInfo.token : null;
  }
  return null;
};

// Export Axios request methods
const requests = {
  get: (url, config) => instance.get(url, config).then((response) => response.data),
  post: (url, body, config) => instance.post(url, body, config).then((response) => response.data),
  put: (url, body, config) => instance.put(url, body, config).then((response) => response.data),
  delete: (url, config) => instance.delete(url, config).then((response) => response.data),
};

export const serverRequests = {
  get: async (url, req) => {
    const token = getTokenFromRequest(req);
    const response = await instance.get(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    });
    return response.data;
  },
  post: async (url, body, req) => {
    const token = getTokenFromRequest(req);
    const response = await instance.post(url, body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    });
    return response.data;
  },
};

export default requests;
