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


   const leadsApproved = [
    { id: 1, approval_date: "2025-10-16", approval_count: 55 },
    { id: 6, approval_date: "2025-10-17", approval_count: 70 },
  ];

  
  return (
        <div className="relative h-screen w-full p-0 flex justify-center items-center">
          <div className="absolute top-0 mx-auto container z-50">
            <NavBar />
          </div>
          <div className="z-40 w-9/12 relative h-screen flex justify-center items-center ">
            <div className="absolute top-35 pb-20 w-full">
              <ChartAreaInteractive chartData={logs} leadsApproved={leadsApproved}/>
            </div>
          </div>
        </div>
  )
}

export default Charts