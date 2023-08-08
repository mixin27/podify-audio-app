import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.0.17:7777',
});

export default client;
