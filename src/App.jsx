import { useEffect, useState } from "react";
import "./App.css";
import Home from "./views/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoaderTest from "./views/LoaderTest";
import Logs from "./views/Logs";
import Charts from "./views/Charts";
import Main from "./components/layout/Main";
import Login from "./views/Login";
import ProtectUser from "./utils/ProtectUser";
import ToEncodeList from "./views/ToEncodeList";
import { useDispatch, useSelector } from "react-redux";
import { wakeBackend } from "./store/reducers/authReducer";
import GetLeadDetails from './views/GetLeadDetails';

function App() {
  const dispatch = useDispatch();
  const { isBackendReady } = useSelector((state) => state.auth);

  useEffect(() => {
    let retryInterval;

    // Only start retrying if backend is not ready
    if (!isBackendReady) {
      console.log("[Backend] Initial wake attempt...");
      dispatch(wakeBackend());

      // Keep retrying every 3 seconds until it becomes ready
      retryInterval = setInterval(() => {
        console.log("[Backend] Retrying wake check...");
        dispatch(wakeBackend());
      }, 3000);
    }

    // Cleanup interval when ready or on unmount
    return () => {
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [isBackendReady, dispatch]);

  console.log(`isBackendReady: ${isBackendReady}`);

  if (!isBackendReady) {
    return (
      <div className="loading-screen h-screen bg-black/60 flex justify-center items-center">
        <div className="relative inline-flex">
          <div className="rounded-full bg-green-400 h-[40px] w-[40px] inline-block mr-2">
            <img src="/images/logo_wakey.png" className="w-full h-full" alt="" />
          </div>
          <div className="absolute animate-ping rounded-full bg-green-400 h-[40px] w-[40px] mr-2"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectUser />}>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/loader" element={<LoaderTest />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/dashboard" element={<Charts />} />
          <Route path="/to-encode" element={<ToEncodeList />} />
          <Route path="/get-details" element={<GetLeadDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
