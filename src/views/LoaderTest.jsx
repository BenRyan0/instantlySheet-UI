import React, { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/ChartAreaInteractive";
import LoaderProgress  from "@/components/custom/loading/LoaderProgress";
import { socket } from "../utils/utils";

const LoaderTest = () => {
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleProgress = (progress) => {
      console.log("New progress:", progress);

      // Push each new progress object into the array
      setProgressList((prevList) => [...prevList, progress]);
    };

    socket.on("progress", handleProgress);

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off("progress", handleProgress);
    };
  }, [socket]);

  useEffect(()=>{
    console.log(progressList)
    console.log("progressList")
  })


  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-10/12">
      <LoaderProgress progressArray= {progressList}/>
      </div>
    </div>
  );
};

export default LoaderTest;
