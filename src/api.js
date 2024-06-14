// src/axios.js
import axios from 'axios';

const backend = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your FastAPI base URL
});

export default backend;
