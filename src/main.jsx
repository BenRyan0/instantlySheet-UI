import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store/index";

ReactDOM.createRoot(document.getElementById('root')).render(
 <Provider store={store}>
    <App />
    <Toaster
      toastOptions={{
        position: "top-right",
        style: {
          background: "white",
          color: "black",
          margin: "10px 160px"
        },
      }}
    />
  </Provider>
)
