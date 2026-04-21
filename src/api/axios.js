import axios from "axios";

const API = axios.create({
  baseURL: "https://slotify-backend-hw4r.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;