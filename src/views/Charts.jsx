import React, { useEffect, useMemo, useState } from "react";
import { NavBar } from "./../components/layout/NavBar";
import { ChartAreaInteractive } from "@/components/custom/dashboardCharts/chart-area-interactive";
import { ReplyClassification } from "@/components/custom/dashboardCharts/ReplyClassification";
import { getAllLogs, getDailyLog } from "@/store/reducers/logsReducer";
import { useDispatch, useSelector } from "react-redux";
import { addDays } from "date-fns";

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/shadcn-io/mini-calendar";

import { Spinner } from "@/components/ui/spinner";
import { PerPageComboboxCharts } from "./../components/utils/PerPageComboboxCharts";
import { RadialChartEncoded } from "./../components/charts/RadialChartEncoded";
import { RadialChartEncodedTotal } from "./../components/charts/RadialChartEncodedTotal";
import { Skeleton } from "@/components/ui/skeleton";
import { socket } from "../utils/utils";
import toast from "react-hot-toast";

const Charts = () => {
  const dispatch = useDispatch();
  const {
    logs,
    encodingClassification,
    loader,
    dailyLog,
    dailyLogLoader,
    totalLog,
  } = useSelector((state) => state.logs);

  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log(selectedDate);
  console.log("selectedDate");
  const perPage = [
    {
      value: "7",
      label: "7 Days",
    },
    {
      value: "10",
      label: "10 Days",
    },
    {
      value: "15",
      label: "15 Days",
    },
  ];

  const [value, setValue] = React.useState(perPage[0].value);
  const [loadDelay, setLoadDelay] = useState(false);
  const days = value;
  const [startDate, setStartDate] = useState(() => {
    // Set initial start = today positioned at end
    const today = new Date();
    return addDays(today, -(days - 1));
  });

  const endDate = useMemo(() => {
    if (!startDate) return null;
    return addDays(startDate, days - 1);
  }, [startDate, days]);

  useEffect(() => {
    setLoadDelay(true);
    // If either date is empty/null, don't trigger anything
    if (!startDate || !endDate) return;
    // console.log("Dates changed. Starting 30s wait…");
    // Start 30-second timer
    const timer = setTimeout(() => {
      // console.log("No changes for 30s → Fetching logs...");

      function formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      dispatch(
        getAllLogs({
          startDate: formatLocalDate(startDate),
          endDate: formatLocalDate(endDate),
        })
      );
      setLoadDelay(false);
    }, 2000);

    // Cleanup function:
    // Runs whenever startDate/endDate changes BEFORE 30s
    return () => {
      clearTimeout(timer);
    };
  }, [startDate, endDate]);

  console.log(`value: ${value}`);

  console.log(`Perpage : ${perPage}`);

  console.log("selectedDateGraph");
  console.log(selectedDate);

  useEffect(() => {
    if (!selectedDate) return; // Skip if no date is selected
    // Set a 3-second delay
    const timer = setTimeout(() => {
      dispatch(getDailyLog({ date: selectedDate }));
    }, 4000);
    // Cleanup: cancel previous timer if selectedDate changes within 3 seconds
    return () => clearTimeout(timer);
  }, [selectedDate, dispatch]);

// 
useEffect(() => {
  if (!socket) return;

  const handleEncodingRefresh = () => {
    toast.success("Lead Processed")
    if (!startDate || !endDate || !selectedDate) return;

    // ---- format date properly ----
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // ---- re-fetch ALL logs ----
    dispatch(
      getAllLogs({
        startDate: formatLocalDate(startDate),
        endDate: formatLocalDate(endDate),
      })
    );

    // ---- re-fetch DAILY log ----
    dispatch(
      getDailyLog({
        date: selectedDate,
      })
    );
  };

  socket.on("encoding_progress", handleEncodingRefresh);

  return () => {
    socket.off("encoding_progress", handleEncodingRefresh);
  };
}, [socket, startDate, endDate, selectedDate, dispatch]);


  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center ">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>
      <div className="z-40 w-11/12 md:w-9/12 relative h-screen flex justify-center items-center ">
        <div className="absolute top-35 pb-20 w-full gap-5 flex flex-col">
          <div className="flex justify-between md:flex-row items-center flex-col-reverse gap-1">
            <div className="flex">
              <MiniCalendar
                days={days}
                startDate={startDate}
                onStartDateChange={setStartDate}
                value={selectedDate} // <-- controlled value
                onValueChange={setSelectedDate} // <-- gets selectedDate here
              >
                <MiniCalendarNavigation direction="prev" />
                <MiniCalendarDays>
                  {(date) => (
                    <MiniCalendarDay date={date} key={date.toISOString()} />
                  )}
                </MiniCalendarDays>
                <MiniCalendarNavigation direction="next" />
              </MiniCalendar>
              <div
                className={`md:flex justify-center items-center text-center hidden ${
                  loadDelay ? "text-gray-500" : loader ? "text-green-500" : ""
                }`}
              >
                {(loadDelay || loader) && <Spinner />}
              </div>
            </div>

            <div className="w-full md:flex justify-start items-center md:justify-end hidden">
              <PerPageComboboxCharts
                setValue={setValue}
                value={value}
                frameworks={perPage}
              />
            </div>
          </div>
          <div className="flex justify-between items-center gap-3 w-full flex-col md:flex-row">
            <div className="w-full">
              <ChartAreaInteractive chartData={logs} />
            </div>
            <div className="w-[260px] flex justify-center flex-col items-center">
              {dailyLogLoader ? (
                <div className="flex items-center justify-center h-64">
                  {/* <Spinner /> */}
                  <Skeleton className="h-[270px] w-[250px]" />
                </div>
              ) : Array.isArray(totalLog) && totalLog.length > 0 ? (
                <RadialChartEncodedTotal chartData={totalLog} />
              ) : (
                <Skeleton className="h-[270px] w-[250px] bg-gray-400/5" />
              )}
            </div>
          </div>

          <div className="flex justify-between md:flex-row-reverse gap-3 w-full flex-col items-center">
            <div className="w-full">
              <ReplyClassification chartData={encodingClassification} />
            </div>

            <div className="">
              {dailyLogLoader ? (
                <div className="flex items-center justify-center h-64">
                  <Skeleton className="h-[270px] w-[250px]" />
                </div>
              ) : Array.isArray(dailyLog) && dailyLog.length > 0 ? (
                <RadialChartEncoded chartData={dailyLog} />
              ) : (
                <Skeleton className="h-[270px] w-[250px] bg-gray-400/5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
