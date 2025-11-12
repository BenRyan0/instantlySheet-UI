import React, { useEffect } from "react";
import { NavBar } from "./../components/layout/NavBar";
import { ChartAreaInteractive } from "@/components/custom/dashboardCharts/chart-area-interactive";
import { ReplyClassification } from "@/components/custom/dashboardCharts/ReplyClassification";
import { getAllLogs } from "@/store/reducers/logsReducer";
import { useDispatch, useSelector } from "react-redux";

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/shadcn-io/mini-calendar";

const Charts = () => {
  const dispatch = useDispatch();
  const { logs, encodingClassification } = useSelector((state) => state.logs);

  useEffect(() => {
    dispatch(getAllLogs());
  }, []);

  const now = new Date();

  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>
      <div className="z-40 w-9/12 relative h-screen flex justify-center items-center ">
        <div className="absolute top-35 pb-20 w-full gap-5 flex flex-col">
          <ChartAreaInteractive chartData={logs} />
          {/* <div className="">
            <MiniCalendar days={10}> 
              <MiniCalendarNavigation direction="prev" />
              <MiniCalendarDays>
                {(date) => (
                  <MiniCalendarDay date={date} key={date.toISOString()} />
                )}
              </MiniCalendarDays>
              <MiniCalendarNavigation direction="next" />
            </MiniCalendar>
          </div> */}
          <ReplyClassification chartData={encodingClassification} />
        </div>
        <div className="">asd</div>
      </div>
    </div>
  );
};

export default Charts;
