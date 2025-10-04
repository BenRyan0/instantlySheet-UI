import { useState } from "react";

import "./App.css";
import Home from "./views/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoaderTest from "./views/LoaderTest";
import Logs from "./views/Logs";
import Charts from "./views/Charts";
import Main from "./components/layout/Main";
import Login from "./views/Login";
import ProtectUser from "./utils/ProtectUser";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
            {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logs" element={<Logs />} /> */}
          {/* <Route path="/dashboard" element={<Charts />} /> */}
        <Route element={<ProtectUser />}>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/loader" element={<LoaderTest />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/dashboard" element={<Charts />} />
        </Route>
      </Routes>
      {/* <Routes>
         <Route path='/' element = {<Home/>}/> 
         <Route path='/main' element = {<Main/>}/> 
         <Route path='/loader' element = {<LoaderTest/>}/> 
         <Route path='/logs' element = {<Logs/>}/> 
         <Route path='/dashboard' element = {<Charts/>}/> 
      </Routes> */}
    </BrowserRouter>
    // <div className="w-full h-screen">
    //   <Home />
    // </div>
  );
}

export default App;
