"use client";

import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ProgressImage } from "@/components/ui/ProgressImage";
import { FaCode } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  stopEncoding,
} from "@/store/reducers/instantlyAiReducer";
import { FaStop } from "react-icons/fa";

const LoaderProgress = ({ progressArray, maxPage, maxEmailsCap }) => {
  const dispatch = useDispatch();

  const { successMessage, errorMessage } = useSelector(
    (state) => state.instantlyAi
  );

  const [latestValue, setLatestValue] = useState({});

  useEffect(() => {
    if (progressArray.length > 0) {
      const latest = progressArray[progressArray.length - 1];
      console.log("Latest value:", latest);
      setLatestValue(latest);
    }
  }, [progressArray]);

  console.log(
    "------------------------ progressArray ------------------------"
  );
  console.log(progressArray);
  console.log("------------------------ latestValue ------------------------");
  console.log(latestValue.runId);

  const fieldsToShow = [
    {
      key: "totalEmailsCollected",
      label: "Emails Collected",
      icon: <FaCode />,
    },
    {
      key: "unProcessedLeads",
      label: "New Lead",
      icon: <FaCode />,
    },
    {
      key: "pagesFetched",
      label: "Pages Fetched",
      icon: <FaCode />,
    },
    {
      key: "totalInterestedLLM",
      label: "LLM:INTERESTED",
      icon: <FaCode />,
    },
    {
      key: "totalEncoded",
      label: "Encoded Replies",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="50"
          height="100"
          viewBox="0 0 50 50"
        >
          <path
            fill="#43a047"
            d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z"
          ></path>
          <path fill="#c8e6c9" d="M40 13L30 13 30 3z"></path>
          <path fill="#2e7d32" d="M30 13L40 23 40 13z"></path>
          <path
            fill="#e8f5e9"
            d="M31,23H17h-2v2v2v2v2v2v2v2h18v-2v-2v-2v-2v-2v-2v-2H31z M17,25h4v2h-4V25z M17,29h4v2h-4V29z M17,33h4v2h-4V33z M31,35h-8v-2h8V35z M31,31h-8v-2h8V31z M31,27h-8v-2h8V27z"
          ></path>
        </svg>
      ),
    },
    {
      key: "percentComplete",
      label: "PROGRESS",
      icon: <FaCode />,
    },
  ];

  // Use the latest progress OR fallback to zeros
  const latest =
    progressArray && progressArray.length > 0
      ? progressArray[progressArray.length - 1]
      : fieldsToShow.reduce((acc, { key }) => ({ ...acc, [key]: 0 }), {});

  // Shared "version" counter → increments only when progressArray updates
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (progressArray && progressArray.length > 0) {
      setVersion((v) => v + 1);
    }
  }, [progressArray?.length]); // only run when length changes

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

  return (
    <div className="relative">
      <div className="shadow-lg shadow-green-700/60 bg-white rounded-sm p-3">
        {/* <div className="mx-auto flex flex-row gap-5 px-10 py-2 w-full max-w-7xl bg-transparent"> */}
        <div className="mx-auto grid w-full min-w-md max-w-7xl grid-cols- md:grid-cols-6 lg:grid-cols-6 bg-transparent">
          {fieldsToShow.map(({ key, label, icon }) => (
            <ProgressItem
              key={key}
              label={label}
              value={latest[key]}
              version={version}
              icon={icon}
              maxPage={maxPage}
              maxEmailsCap={maxEmailsCap}
            />
          ))}
        </div>
        <div className=" mx-auto w-full max-w-full pb-2 px-2 flex justify-center items-end">
          <Progress
            value={latestValue.percentComplete}
            className="bg-gray-400/60 rounded-2xl mx-2"
          />
        </div>
      </div>
      <div className="absolute -top-6 inset-x-0 flex justify-end items-end text-xs group">
        <button
          onClick={() => dispatch(stopEncoding({ runId: latestValue.runId }))}
          className="flex justify-center items-center gap-1.5 px-2 py-0.5 rounded-xs transition-all duration-300 bg-red-600/10 text-red-600 hover:bg-red-600/20 focus-visible:ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/20 dark:focus-visible:ring-red-400/40"
        >
          <FaStop size={9} />
          <span className="text-[10px]">Stop</span>
        </button>
      </div>
    </div>
  );
};

const ProgressItem = ({
  label,
  value,
  version,
  icon,
  maxPage,
  maxEmailsCap,
}) => {
  const { ref, animatedValue } = useAnimatedValue(value, version);

  return (
    <div className="flex flex-col items-center justify-center gap-1 border-r border-none  md:h-27 md:gap-2 text-center px-3">
      <div className="relative w-full overflow-hidden text-center  ">
        <div className="flex justify-center items-center gap-1">
          <span
            ref={ref}
            className="block text-4xl font-medium text-green-700/60 md:text-4xl lg:text-4xl xl:text-4xl MatrixFont "
          >
            {String(animatedValue)}
            {label === "Pages Fetched" ? `/${maxPage}` : ""}
            {label === "Emails Collected" ? `/${maxEmailsCap}` : ""}
            {label === "PROGRESS" ? "%" : ""}
          </span>
          {/* <div className="text-black w-6 h-6 md:w-8 md:h-8 flex justify-center items-center absolute right-3">
            {icon}
          </div> */}
        </div>
      </div>
      {/* <span className="text-xs font-bold text-slate-500 md:text-sm lg:text-base px-3 text-center text-wrap">
        {label}
      </span> */}
      <p className="text-black text-[9px]">
        {label}
      </p>
    </div>
  );
};

// Hook for animating value changes, synced with version
const useAnimatedValue = (value, version) => {
  const [ref, animate] = useAnimate();
  const valueRef = useRef(value);
  const [animatedValue, setAnimatedValue] = useState(value);

  useEffect(() => {
    const start = valueRef.current;
    const end = value;
    const duration = 100;
    const steps = 10;
    const stepTime = duration / steps;
    let currentStep = 0;

    animate(
      ref.current,
      { y: ["0%", "-20%"], opacity: [1, 0] },
      { duration: 0.25 }
    ).then(() => {
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const newVal = Math.round(start + (end - start) * progress);
        setAnimatedValue(newVal);

        if (currentStep >= steps) {
          clearInterval(interval);
          valueRef.current = end;
          animate(
            ref.current,
            { y: ["50%", "0%"], opacity: [0, 1] },
            { duration: 0.25 }
          );
        }
      }, stepTime);
    });
  }, [version]); // syncs only when parent bumps version

  return { ref, animatedValue };
};

export default LoaderProgress;
