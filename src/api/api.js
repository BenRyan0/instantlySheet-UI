import axios from "axios";
const local = "http://localhost:3000";
const production1 = "http://localhost:3000";

let api_url = ''
let mode = 'pro'


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