"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";

export function ExpandableCardsToEncode({ cards }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  function shortenText(text, wordLimit = 8) {
    if (!text) return "";
    const words = text.split(/\s+/); // split by spaces
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  }

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.lead_email}-${id}`}
              ref={ref}
              className="w-full max-w-[750px] h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden p-3"
            >
              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
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
                      className="text-neutral-600 dark:text-neutral-400 mt-2"
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
                    <motion.p
                      layoutId={`description-${active.address}${active.lead_email}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 "
                    >
                      <span className="font-semibold">{active.city}</span>
                      <span className="font-semibold">{active.state}</span>
                      <span className="font-semibold">{active.zip}</span>
                    </motion.p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <motion.a
                      layoutId={`button-${active.lead_email}-${id}`}
                      href={active.encodeLink}
                      target="_blank"
                      className="px-4 py-3 text-sm rounded-sm font-bold bg-green-500 text-white flex justify-start items-center duration-300 transition-all"
                    >
                      Encode
                      {/* {active.encodeText} */}
                      <FaChevronRight />
                    </motion.a>
                    <motion.a
                      layoutId={`button-${active.company}-${id}`}
                      href={active.denyLink}
                      target="_blank"
                      className="px-4 py-3 text-sm rounded-sm font-bold bg-red-400 text-white flex justify-start items-center duration-300 transition-all "
                    >
                      <FaChevronLeft/>
                      Deny
                      {/* {active.denyText} */}
                    </motion.a>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-2 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">Email Reply: </span>
                      <p>{active.email_signature}</p>
                    </div>
                  </motion.div>
                </div>
                <div className="pt-4 relative px-4">
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
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.lead_email}-${id}`}
            key={`card-${card.lead_email}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <div className="">
                <motion.h3
                  layoutId={`title-${card.company}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {index + 1}. {card.company}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.lead_first_name}-${card.lead_last_name}-${card.lead_email}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.lead_first_name} {card.lead_last_name}
                  <span className="pl-2"> | {card.lead_email}</span>
                </motion.p>
                <motion.p
                  layoutId={`description-${card.company_phone}-${id}`}
                  className="mt-2 text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  <span>Reply: </span>
                  {shortenText(card.email_reply, 7)}
                </motion.p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <motion.button
                layoutId={`button-${card.details}-${id}`}
                className="px-4 py-2 text-sm rounded-xs font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0  flex justify-start items-center gap-1 transition-all duration-300 "
              >
                Encode
                <FaChevronRight />
              </motion.button>
              <motion.button
                layoutId={`button-${card.lead_email}-${id}`}
                className="px-4 py-2 text-sm rounded-xs font-bold bg-gray-100 hover:bg-red-400 hover:text-white text-black mt-4 md:mt-0  flex justify-start items-center gap-1 transition-all duration-300 "
              >
                <FaChevronLeft />
                Deny
              </motion.button>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
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
};
