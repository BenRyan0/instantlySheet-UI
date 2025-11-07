"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export function ExpandableCardsToEncode({ cards, onEncode, onDeny, loader }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  const stripTimestamp = (rawValue) => {
    if (!rawValue || typeof rawValue !== "string") return "—";

    // Convert PostgreSQL timestamp ("2025-10-11 01:03:59+08") to ISO-compatible format
    const isoLike = rawValue.replace(" ", "T");
    const date = new Date(isoLike);
    if (isNaN(date)) return rawValue;

    // Format date part: "Oct 11, 2025"
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit", // gives "25" instead of "2025"
    });

    // Compute "x days/hours ago"
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeAgo = "";
    if (diffMinutes < 1) timeAgo = "just now";
    else if (diffMinutes < 60) timeAgo = `${diffMinutes} min ago`;
    else if (diffHours < 24)
      timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    else timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return `${formattedDate} – ${timeAgo}`;
  };

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") setActive(null);
    }

    document.body.style.overflow = active ? "hidden" : "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  function shortenText(text, wordLimit = 8) {
    if (!text) return "";
    const words = text.split(/\s+/);
    return words.length <= wordLimit
      ? text
      : words.slice(0, wordLimit).join(" ") + "...";
  }

  return (
    <>
      {/* Overlay Background */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100] bg-black/85">
            <motion.button
              key={`close-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.lead_email}-${id}`}
              ref={ref}
              className="w-full max-w-6/12 h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden p-3"
            >
              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <div className="flex gap-2 text-md py-1 pb-5">
                      <span className="font-bold">Date: </span>
                      <h2>{stripTimestamp(active.reply_timestamp)}</h2>
                    </div>

                    <motion.h3
                      layoutId={`company-${active.company}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 text-xl"
                    >
                      {active.company}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.lead_first_name}${active.lead_last_name}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.lead_first_name} {active.lead_last_name}
                      <span> | {active.lead_email}</span>
                    </motion.p>
                    <motion.p
                      layoutId={`description-${active.company_phone}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 mt-3 border-t py-1 "
                    >
                      <span className="font-semibold">Company phone: </span>
                      {active.company_phone}
                    </motion.p>
                    <motion.p
                      layoutId={`description-${active.address}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 "
                    >
                      <span className="font-semibold">Address: </span>
                      {active.address}
                    </motion.p>
                    <motion.div
                      layoutId={`description-${active.address}${active.lead_email}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 border-y mt-2 py-2 flex gap-3"
                    >
                      <h2>
                        <span className="font-semibold">City: </span>
                        <span className="font-semibold">{active.city}</span>
                      </h2>
                      <h2>
                        <span className="font-semibold">State: </span>
                        <span className="font-semibold">{active.state}</span>
                      </h2>
                      <h2>
                        <span className="font-semibold">Zip: </span>
                        <span className="font-semibold">{active.zip}</span>
                      </h2>
                    </motion.div>
                    <div className="pt-4 relative">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-50 md:h-fit pb-2 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 "
                      >
                        <div className="flex flex-col gap-1 pb-2 ">
                          <span className="font-bold">Email Reply: </span>
                          <p>{active.email_reply}</p>
                        </div>
                        <div className="flex flex-col gap-1  border-y py-2">
                          <span className="font-bold">Description: </span>
                          <p>{active.details}</p>
                        </div>
                      </motion.div>
                    </div>
                    <div className="pt-4 relative">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-2 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                      >
                        <div className="font-bold">
                          <h2>Sales Person</h2>
                        </div>
                        <div className="flex gap-1">
                          <span>Name: </span>
                          <p>{active.sales_person}</p>
                        </div>
                        <div className="flex gap-1">
                          <span>Email: </span>
                          <p>{active.sales_person_email}</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Encode / Deny Buttons */}
                  <div className="flex flex-col gap-2 ">
                    <motion.button
                      layoutId={`encode-${active.lead_email}-${id}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = onEncode?.(active);
                          if (res && res.then) await res;
                        } finally {
                          setActive(null);
                        }
                      }}
                      className="px-4 py-3 text-sm rounded-sm font-bold bg-green-500 text-white flex justify-start items-center gap-1 hover:bg-green-600 transition-all"
                    >
                      Encode <FaChevronRight />
                    </motion.button>

                    <motion.button
                      layoutId={`deny-${active.company}-${id}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = onDeny?.(active);
                          if (res && res.then) await res;
                        } finally {
                          setActive(null);
                        }
                      }}
                      className="px-4 py-3 text-sm rounded-sm font-bold bg-red-400 text-white flex justify-start items-center gap-1 hover:bg-red-500 transition-all"
                    >
                      <FaChevronLeft /> Deny
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed List View */}
      <ul className="max-w-2xl mx-auto w-full gap-6">
        {(cards || []).map((card, index) => {
          const key = `${card.lead_email || index}-${id}`;
          const layoutPrefix = `${id}-${card.lead_email || index}`;
          const fullName = `${card.lead_first_name ?? ""} ${
            card.lead_last_name ?? ""
          }`.trim();
          const shortReply = shortenText(card.email_reply ?? "", 7);

          return (
            <motion.li
              key={key}
              layoutId={`card-${layoutPrefix}`}
              onClick={() => setActive(card)}
              className="p-4 mt-5 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors relative"
            >
              {/* Left content */}
              <div className="bg-slate-800/60 absolute -top-3 px-3 rounded-xs flex gap-2 text-xs py-1 left-0">
                <span>Date: </span>
                <h2>{stripTimestamp(card.reply_timestamp)}</h2>
              </div>
              <div className="flex gap-4 flex-col md:flex-row">
                <div>
                  <motion.h3
                    layoutId={`title-${layoutPrefix}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    {index + 1}. {card.company ?? "Unknown Company"}
                  </motion.h3>

                  <motion.p className="text-neutral-600 dark:text-neutral-400">
                    {fullName || "Unknown Lead"}
                    {card.lead_email && (
                      <span className="pl-2">| {card.lead_email}</span>
                    )}
                  </motion.p>

                  {card.email_reply && (
                    <motion.p className="mt-2 text-neutral-600 dark:text-neutral-400">
                      <span>Reply: </span>
                      {shortReply}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Right buttons */}
              <div className="flex flex-col gap-2">
                <motion.button
                  layoutId={`encode-${layoutPrefix}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEncode?.(card);
                  }}
                  className="px-4 py-2 text-sm rounded-md font-semibold bg-gray-100 hover:bg-green-500 hover:text-white text-black flex items-center gap-1 transition-colors duration-300"
                >
                  Encode <FaChevronRight />
                </motion.button>

                <motion.button
                  layoutId={`deny-${layoutPrefix}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeny?.(card);
                  }}
                  className="px-4 py-2 text-sm rounded-md font-semibold bg-gray-100 hover:bg-red-400 hover:text-white text-black flex items-center gap-1 transition-colors duration-300"
                >
                  <FaChevronLeft /> Deny
                </motion.button>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);
