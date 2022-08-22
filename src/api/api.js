import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://104.248.113.20:8080/',
  responseType: 'json',
});
export default instance;
