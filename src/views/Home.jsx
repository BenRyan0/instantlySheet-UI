import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavBar } from "./../components/layout/NavBar";
import { InstantlyFilterForm } from "../components/InstantlyFilterForm";
import { getExistingSheets, messageClear } from "@/store/reducers/sheetReducer";
import toast from "react-hot-toast";
import { getExistingCampaigns } from "@/store/reducers/instantlyAiReducer";
import LoaderProgress from "./../components/custom/loading/LoaderProgress";
import { socket } from "../utils/utils";

const Home = () => {
  const dispatch = useDispatch();
  const { existingSheets, successMessage, errorMessage } = useSelector(
    (state) => state.sheet
  );
  const { existingCampaigns, instantlyloader, encodingLoader } = useSelector(
    (state) => state.instantlyAi
  );

  const [progressList, setProgressList] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [maxEmailsCap, setMaxEmailsCap] = useState(0);
  const [forceShowLoader, setForceShowLoader] = useState(false);

  // ref to store timeout id
  const inactivityTimer = useRef(null);

  // Messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    } else if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Load existing data
  useEffect(() => {
    dispatch(getExistingSheets(import.meta.env.VITE_SHEET_ID));
    dispatch(getExistingCampaigns());
  }, []);

  // Socket listener for progress updates
  useEffect(() => {
    if (!socket) return;

    const handleProgress = (progress) => {
      console.log("New progress:", progress);

      // Add new progress to the array
      setProgressList((prevList) => [...prevList, progress]);

      // Whenever new progress comes in, force show the loader
      setForceShowLoader(true);

      // Reset inactivity timer
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        console.log("No new progress for threshold → closing loader");
        setForceShowLoader(false);
      }, 60000); // ⏱ 10 seconds threshold
    };

    socket.on("progress", handleProgress);

    return () => {
      socket.off("progress", handleProgress);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [socket]);

  // Debug log
  useEffect(() => {
    console.log(progressList, "progressList");
  }, [progressList]);

  // Grab maxPage + maxEmailsCap from first progress
  useEffect(() => {
    if (Array.isArray(progressList) && progressList.length > 0) {
      setMaxPage(progressList[0].maxPagesCap);
      setMaxEmailsCap(progressList[0].maxEmailsCap);
    }
  }, [progressList]);

  // Decide when loader should show
  const shouldShowLoader =
    encodingLoader ||
    forceShowLoader ||
    (Array.isArray(progressList) &&
      progressList.length > 0 &&
      progressList.every((item) => item.percentComplete === 100));

  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute inset-0 z-10">
        <NavBar />
      </div>
      <div className="flex pt-40 md:pt-10 pb-10 px-4 z-40 w-full justify-center items-center flex-col">
        <InstantlyFilterForm
          className={"w-11/12 md:w-[500px]"}
          existingSheets={existingSheets}
          existingCampaigns={existingCampaigns}
          instantlyloader={Boolean(instantlyloader)}
          encodingLoader={Boolean(encodingLoader)}
        />
      </div>
      {shouldShowLoader && (
        <div className="absolute bg-black/80 inset-0 z-50 flex justify-center items-center">
          <LoaderProgress
            progressArray={progressList}
            maxPage={maxPage}
            maxEmailsCap={maxEmailsCap}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
