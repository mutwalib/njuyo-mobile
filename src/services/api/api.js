import axios from 'axios';
export const bURL = 'https://admin.njuyo.com'; //remote
// export const bURL = 'http://localhost:8082'; //local
// export const SOCKET_URL = 'ws://admin.njuyo.com/websocket'; //remote
export const axiosClient = axios.create({
  baseURL: bURL + '/api',
  headers: {
    'Content-type': 'application/json',
    'Api-Key': '	4RPJln2MkX0_2UAEmMhN7sAfQkFDCzfpK91hAu3LM5I', //remote
  },
});
export default axiosClient;
