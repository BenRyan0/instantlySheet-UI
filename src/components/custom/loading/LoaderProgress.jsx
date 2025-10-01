"use client";

import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FaCode } from "react-icons/fa";

const LoaderProgress = ({ progressArray, maxPage,maxEmailsCap }) => {
  const fieldsToShow = [
    {
      key: "totalEmailsCollected",
      label: "Emails Collected",
      icon: <FaCode />,
    },
    {
      key: "interestedLeadCount",
      label: "Interested",
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

  console.log(maxPage);
  console.log("maxPage");
  console.log(maxEmailsCap);
  console.log("maxEmailsCap");
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

  return (
    <div className="p-4">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white shadow-lg shadow-cyan-500">
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
      <div className=" mx-auto w-full max-w-5xl">
        <Progress value={latest.percentComplete} className="bg-slate-50" />
      </div>
    </div>
  );
};

const ProgressItem = ({ label, value, version, icon,  maxPage,maxEmailsCap }) => {
  const { ref, animatedValue } = useAnimatedValue(value, version);

  return (
    <div className="flex flex-col items-center justify-center gap-1 border-r border-slate-200 font-mono md:h-27 md:gap-2 ">
      <div className="relative w-full overflow-hidden text-center MatrixFont  ">
        <div className="flex justify-center items-center gap-1">
          <span
            ref={ref}
            className="block text-lg font-medium text-cyan-500/60 md:text-3xl lg:text-4xl xl:text-5xl"
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
      <span className="text-[10px] font-bold text-slate-500 md:text-sm lg:text-base px-3 text-center text-wrap">
        {label}
      </span>
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
