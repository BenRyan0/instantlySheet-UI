import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavBar } from "./../components/layout/NavBar";
import { InstantlyFilterForm } from "../components/InstantlyFilterForm";
import { getExistingSheets, messageClear } from "@/store/reducers/sheetReducer";
import toast from "react-hot-toast";
import {
  getExistingCampaigns,
  navigateToLogsClear,
} from "@/store/reducers/instantlyAiReducer";
import LoaderProgress from "./../components/custom/loading/LoaderProgress";
import { socket } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { EncodingConfirmationForm } from "./../components/EncodingConfirmationForm";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { existingSheets, successMessage, errorMessage } = useSelector(
    (state) => state.sheet
  );
  const { existingCampaigns, instantlyloader, encodingLoader, navigateToLogs } =
    useSelector((state) => state.instantlyAi);
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
    // dispatch(getExistingCampaigns());
  }, []);

  // Socket listener for progress updates
  useEffect(() => {
    if (!socket) return;

   const handleProgress = (progress) => {
  console.log("New progress:", progress);

  setProgressList((prevList) => {
    // If the list is empty or the new runId matches, append normally
    if (prevList.length === 0 || prevList[0].runId === progress.runId) {
      return [...prevList, progress];
    }

    // Otherwise, it's a new run — clear previous progress and start fresh
    console.log(
      `New run detected (${progress.runId}) → clearing previous progress.`
    );
    return [progress];
  });

  // Force show loader whenever a new progress comes in
  setForceShowLoader(true);

  // Reset inactivity timer
  if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  inactivityTimer.current = setTimeout(() => {
    console.log("No new progress for threshold → closing loader");
    setForceShowLoader(false);
  }, 10000); // 10 seconds
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

  useEffect(() => {
    if (Array.isArray(progressList) && progressList.length > 0) {
      const lastItem = progressList[progressList.length - 1];
      setMaxPage(lastItem.maxPagesCap);
      setMaxEmailsCap(lastItem.maxEmailsCap);
    }
  }, [progressList]);

  const shouldShowLoader =
    encodingLoader ||
    forceShowLoader ||
    (Array.isArray(progressList) &&
      progressList.length > 0 &&
      progressList.every((item) => item.percentComplete === 100));

  useEffect(() => {
    if (navigateToLogs) {
      navigateToLogsClear();
      window.open("/dashboard", "_blank"); // opens logs in a new tab/window
    }
  }, [navigateToLogs]);

  const shouldShowLoader1 = true;
  const shouldShowEncondingReq = true;

  console.log("SOCKET");
  console.log(socket.id);

  function getClientUUID() {
    let id = localStorage.getItem("client_uuid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("client_uuid", id);
    }
    return id;
  }
  const clientId = getClientUUID();

  console.log("clientId");
  console.log(clientId);

  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>
      <div className="flex pt-40 md:pt-10 pb-10 px-4 z-40 w-full justify-center items-center flex-col">
        <InstantlyFilterForm
          className={"w-11/12 md:w-[500px]"}
          existingSheets={existingSheets}
          // existingCampaigns={existingCampaigns}
          instantlyloader={Boolean(instantlyloader)}
          encodingLoader={Boolean(encodingLoader)}
          clientId={clientId}
          setProgressList={setProgressList}
        />
      </div>

      {/* {shouldShowEncondingReq && (
        <div className="absolute bg-black/80 inset-0 z-50 flex justify-center items-center overflow-y-scroll pt-[100px] pb-10 ">
        <EncodingConfirmationForm RowData={toBeEncoded}/>
        </div>
      )} */}
      {/* {shouldShowLoader1 && (
        <div className="absolute bg-black/80 inset-0 z-40 flex justify-center items-center">
          <LoaderProgress
            progressArray={progressList}
            maxPage={maxPage}
            maxEmailsCap={maxEmailsCap}
          />
        </div>
      )} */}

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
