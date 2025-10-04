import React from "react";
import { NavBar } from "./NavBar";
import { Link, Outlet } from "react-router-dom";



const Main = () => {
  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center text-white">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>
      <div className="flex pt-40 md:pt-10 pb-10 px-4 z-40 w-full justify-center items-center flex-col">
        <Outlet/>
      </div>
    </div>
  );
};

export default Main;
