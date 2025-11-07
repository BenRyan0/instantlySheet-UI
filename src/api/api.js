import axios from "axios";

const local = "http://localhost:9000";
// const local = "http://localhost:8184";
const production1 = import.meta.env.VITE_PROD_API;

let api_url = ''
let mode = import.meta.env.VITE_MODE;


if(mode === 'prod'){
  api_url = production1
}else{
  api_url = local 
}
const api = axios.create({
  baseURL: `${api_url}/api`,
  withCredentials: true,
});
export default api;