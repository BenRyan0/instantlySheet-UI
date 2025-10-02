import { useState } from "react";

import "./App.css";
import Home from "./views/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoaderTest from "./views/LoaderTest";
import Logs from "./views/Logs";



function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
         <Route path='/' element = {<Home/>}/> 
         <Route path='/loader' element = {<LoaderTest/>}/> 
         <Route path='/logs' element = {<Logs/>}/> 
      </Routes>
    </BrowserRouter>
    // <div className="w-full h-screen">
    //   <Home />
    // </div>
  );
}

export default App;
