import axios from "axios";
const local = "http://localhost:9000";
// const local = "http://localhost:8184";
const production1 = "http://localhost:8184";

let api_url = ''
let mode = 'dev'


if(mode === 'pro'){
  api_url = production1
}else{
  api_url = local 
}
const api = axios.create({
  baseURL: `${api_url}/api`,
  withCredentials: true,
});
export default api;