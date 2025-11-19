import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavBar } from "../components/layout/NavBar";
import { InstantlyFilterForm } from "../components/InstantlyFilterForm";
import {
  getExistingSheets,
  GetSheetData,
  messageClear,
} from "@/store/reducers/sheetReducer";
import {
  getExistingCampaigns,
  navigateToLogsClear,
  resetEncodingState,
} from "@/store/reducers/instantlyAiReducer";
import LoaderProgress from "../components/custom/loading/LoaderProgress";
import { SheetDataChartBar } from "../components/charts/SheetDataChartBar";
import toast from "react-hot-toast";
import { socket } from "../utils/utils";
import { BsExclamationCircle } from "react-icons/bs";
import { Skeleton } from "@/components/ui/skeleton";

const INACTIVITY_TIMEOUT = 10000; // 10 seconds

const Home = () => {
  const dispatch = useDispatch();
  // const sheetStatsLoader = true
  const { existingSheets, successMessage, errorMessage, sheetStats,sheetStatsLoader } =
    useSelector((state) => state.sheet);
  const { instantlyloader, encodingLoader, navigateToLogs, isEncodingDone } =
    useSelector((state) => state.instantlyAi);

  const [progressList, setProgressList] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [maxEmailsCap, setMaxEmailsCap] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  const [selectedSheet, setSelectedSheet] = useState("");
  const [selectedSheetPartership, setSelectedSheetPartership] = useState("");
  const [selectedSheetSBA, setSelectedSheetSBA] = useState("");

  const inactivityTimer = useRef(null);

  // -----------------------------
  // Generate & memoize client UUID
  // -----------------------------
  const clientId = useMemo(() => {
    let id = localStorage.getItem("client_uuid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("client_uuid", id);
    }
    return id;
  }, []);

  // -----------------------------
  // Toast message feedback
  // -----------------------------
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    } else if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // -----------------------------
  // Initial load (only once)
  // -----------------------------
  useEffect(() => {
    dispatch(getExistingSheets(import.meta.env.VITE_SHEET_ID));
    // dispatch(getExistingCampaigns()); // Optional
  }, [dispatch]);

  // -----------------------------
  // Socket connection handling
  // -----------------------------
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => console.log(`[SOCKET] Connected: ${socket.id}`);
    const handleDisconnect = (reason) =>
      console.warn(`[SOCKET] Disconnected → ${reason}`);
    const handleError = (err) =>
      console.error(`[SOCKET] Error → ${err.message}`);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, []);

  // -----------------------------
  // Progress handling (main event)
  // -----------------------------
  useEffect(() => {
    if (!socket) return;

    const handleProgress = (progress) => {
      console.log("[SOCKET] Progress update:", progress);

      setProgressList((prevList) => {
        const isNewRun =
          prevList.length === 0 || prevList[0].runId !== progress.runId;

        // Avoid duplicates by checking if same ID + percentComplete already exists
        const isDuplicate = prevList.some(
          (p) =>
            p.runId === progress.runId &&
            p.percentComplete === progress.percentComplete
        );
        if (isDuplicate) return prevList;

        return isNewRun ? [progress] : [...prevList, progress];
      });

      setShowLoader(true);

      // Reset inactivity timeout
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        console.log("No new progress for 10s → hiding loader");
        setShowLoader(false);
      }, INACTIVITY_TIMEOUT);
    };

    socket.on("progress", handleProgress);

    return () => {
      socket.off("progress", handleProgress);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  // -----------------------------
  // Track max pages & email cap
  // -----------------------------
  useEffect(() => {
    if (progressList.length === 0) return;

    const last = progressList[progressList.length - 1];
    setMaxPage(last.maxPagesCap || 0);
    setMaxEmailsCap(last.maxEmailsCap || 0);
  }, [progressList]);

  // -----------------------------
  useEffect(() => {
    if (!isEncodingDone) return;

    console.log("[APP] Encoding finished → resetting progress");

    setProgressList([]);
    setShowLoader(false);
    setMaxPage(0);
    setMaxEmailsCap(0);

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }

    dispatch(resetEncodingState());
  }, [isEncodingDone, dispatch]);

  // -----------------------------
  // Derived loader visibility
  // -----------------------------
  const shouldShowLoader =
    encodingLoader ||
    showLoader ||
    (progressList.length > 0 &&
      progressList.some((item) => item.percentComplete < 100));

  // -----------------------------
  // Encoding Done Listener
  // -----------------------------
  // -----------------------------
  // Listen for encoding_done
  // -----------------------------
  useEffect(() => {
    if (!socket) return;

    const handleEncodingDone = (payload) => {
      console.log("[SOCKET] Encoding done:", payload);

      // Show toast message
      if (payload?.message) {
        toast.success(payload.message);
      }

      // Clear inactivity timer if any
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
    };

    socket.on("encoding_progress", handleEncodingDone);

    return () => {
      socket.off("encoding_progress", handleEncodingDone);
    };
  }, []);

  useEffect(() => {
    if (navigateToLogs) {
      navigateToLogsClear();
      window.open("/logs", "_blank"); // opens logs in a new tab/window
    }
  }, [navigateToLogs]);

useEffect(() => {
  const sheetNames = [selectedSheetSBA, selectedSheetPartership, selectedSheet]
    .filter(Boolean); // remove null/undefined/empty

  const spreadsheetId = "15ywPV21oF7KKXZUaDaRBH4rAfkyDeyACSA5ExlldTRw";

  if (sheetNames.length === 3) {
    // Only dispatch when all 3 have valid values
    dispatch(GetSheetData({ sheetNames, spreadsheetId }));
  }
}, [selectedSheetSBA, selectedSheetPartership, selectedSheet, dispatch]);


  return (
    <div className="relative h-screen w-full flex justify-center items-center">
      <div className="absolute top-0 w-full container mx-auto z-50">
        <NavBar />
      </div>

      <div className="flex flex-col w-full justify-center items-center pt-40 md:pt-10 pb-10 px-4 z-40 relative">
        <InstantlyFilterForm
          className="w-11/12 md:w-[500px]"
          existingSheets={existingSheets}
          instantlyloader={instantlyloader}
          encodingLoader={encodingLoader}
          clientId={clientId}
          setProgressList={setProgressList}
          selectedSheet={selectedSheet}
          setSelectedSheet={setSelectedSheet}
          selectedSheetPartership={selectedSheetPartership}
          setSelectedSheetPartership={setSelectedSheetPartership}
          selectedSheetSBA={selectedSheetSBA}
          setSelectedSheetSBA={setSelectedSheetSBA}
        />

        <div className="2xl:absolute 2xl:left-8/12 2xl:top-10 2xl:mt-0 mt-10">
          {Array.isArray(sheetStats) && sheetStats.length > 0 ? (
            <SheetDataChartBar chartData={sheetStats} />
          ) : (
            <div className="relative">
              <h2 className={`pl-8 flex text-xs gap-1 text-start bg-gray-500/60 p-3 rounded-xs max-w-[190px] pt-2 opacity-70 ${sheetStatsLoader && ' hidden'}`}>
                Select 3 sheets to show the number of leads per Sheets.
              </h2>

              <span className={`absolute top-3 left-2 ${sheetStatsLoader && ' hidden'}`}><BsExclamationCircle /></span>
              {
                sheetStatsLoader && <Skeleton className="absolute h-[270px] w-[250px] bg-gray-400/5" />

              }
            </div>
          )}
        </div>
      </div>

      {shouldShowLoader && (
        <div className="absolute inset-0 bg-black/80 z-50 flex justify-center items-center">
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
