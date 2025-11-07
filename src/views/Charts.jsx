import React, { useEffect } from 'react'
import { NavBar } from "./../components/layout/NavBar";
import {ChartAreaInteractive}  from '@/components/custom/dashboardCharts/chart-area-interactive';
import { getAllLogs } from "@/store/reducers/logsReducer";
import { useDispatch, useSelector } from "react-redux";

const Charts = () => {
     const dispatch = useDispatch()
  const {logs } = useSelector(
    (state) => state.logs
  );

  useEffect(()=>{
    dispatch(getAllLogs())
  },[])




  
  return (
        <div className="relative h-screen w-full p-0 flex justify-center items-center">
          <div className="absolute top-0 mx-auto container z-50">
            <NavBar />
          </div>
          <div className="z-40 w-9/12 relative h-screen flex justify-center items-center ">
            <div className="absolute top-35 pb-20 w-full">
              <ChartAreaInteractive chartData={logs} />
            </div>
          </div>
        </div>
  )
}

export default Charts