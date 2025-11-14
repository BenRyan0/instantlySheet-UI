import React, { useEffect, useMemo, useState } from "react";
import { NavBar } from "./../components/layout/NavBar";
import { ChartAreaInteractive } from "@/components/custom/dashboardCharts/chart-area-interactive";
import { ReplyClassification } from "@/components/custom/dashboardCharts/ReplyClassification";
import { getAllLogs } from "@/store/reducers/logsReducer";
import { useDispatch, useSelector } from "react-redux";
import { addDays } from "date-fns";

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/shadcn-io/mini-calendar";

import { Spinner } from "@/components/ui/spinner"


const Charts = () => {
  const dispatch = useDispatch();
  const { logs, encodingClassification,loader } = useSelector((state) => state.logs);
  const [loadDelay,setLoadDelay] = useState(false);
  const days = 7;
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
    setLoadDelay(true)
    // If either date is empty/null, don't trigger anything
    if (!startDate || !endDate) return;
    // console.log("Dates changed. Starting 30s wait…");
    // Start 30-second timer
    const timer = setTimeout(() => {
      // console.log("No changes for 30s → Fetching logs...");
      const formattedStart = startDate
        ? startDate.toISOString().split("T")[0]
        : null;
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
      setLoadDelay(false)
    }, 2000);

    // Cleanup function:
    // Runs whenever startDate/endDate changes BEFORE 30s
    return () => {
      // console.log("Dates changed again before 30s → resetting timer…");
      clearTimeout(timer);
    };
  }, [startDate, endDate]);

  // console.log("Start Date:", startDate);
  // console.log("End Date:", endDate);

  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>
      <div className="z-40 w-9/12 relative h-screen flex justify-center items-center ">
        <div className="absolute top-35 pb-20 w-full gap-5 flex flex-col">
          <div className="flex">
            <MiniCalendar
              days={days}
              startDate={startDate}
              onStartDateChange={setStartDate}
            >
              <MiniCalendarNavigation direction="prev" />
              <MiniCalendarDays>
                {(date) => (
                  <MiniCalendarDay date={date} key={date.toISOString()} />
                )}
              </MiniCalendarDays>
              <MiniCalendarNavigation direction="next" />
            </MiniCalendar>
            <div className={`flex justify-center items-center text-center ${loadDelay? "text-gray-500" : loader ? "text-green-500" : ""}`}>
            {(loadDelay || loader) && <Spinner />}

              {/* <Spinner /> */}
            </div>
          </div>
          <ChartAreaInteractive chartData={logs} />
          <ReplyClassification chartData={encodingClassification} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
