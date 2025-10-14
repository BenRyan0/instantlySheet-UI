import { NavBar } from "@/components/layout/NavBar";
import React, { useEffect } from "react";
import { AddNewSheet } from "@/store/reducers/sheetReducer";
import { ExpandableCardsToEncode } from "./../components/custom/Encoding/ExpandableCardsToEncode";
import { getAllToBeEncoded } from "@/store/reducers/toBeEncodedReducer";
import { useDispatch, useSelector } from "react-redux";

const ToEncodeList = () => {
  const dispatch = useDispatch();
  const { toEncode } = useSelector((state) => state.toBeEncoded);

  useEffect(() => {
    dispatch(getAllToBeEncoded());
  }, [dispatch]);

  const cards = [
    {
      id: 7,
      column_1: "InstaSheet-agent1",
      for_scheduling: null,
      sales_person: "Rebecca Brown",
      sales_person_email: "rebecca.brown@grouphealthpledgecover.co",
      company: "Independent Contractors Guild of WNY",
      company_phone: "(716) 315-4230",
      phone_from_email: "none",
      lead_first_name: "Frank",
      lead_last_name: "Daniel",
      lead_email: "info@icgofwny.com",
      column_2: "info@icgofwny.com",
      email_reply:
        "Please forward info on your product for my perusal, as we often have a need for bridge funding.",
      phone_1: "(716) 315-4230",
      phone_number: "(716) 315-4230",
      phone_2: null,
      address: "521 Cornwall Ave.\nBuffalo, NY 14215",
      city: null,
      state: null,
      zip: null,
      details: "https://www.icgofwny.com/",
      email_signature:
        "Please forward info on your product for my perusal, as we often have a need for bridge funding.",
      linkedin_link: "none",
      second_contact_person_linked: "none",
      status_after_call: null,
      number_of_calls_spoken_with_leads: null,
      dropdown: null,
      isdone: false,
      created_at: "2025-10-14T17:13:05.551Z",
      updated_at: "2025-10-14T17:13:05.551Z",

      // description: "Lana Del Rey",
      // title: "Summertime Sadness",
      // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
      denyText: "Deny",
      denyLink: "https://ui.aceternity.com/templatesasdasd",

      encodeText: "Encode",
      encodeLink: "https://ui.aceternity.com/templates",

      // INSTANTLY SHEET DATA FIELDS
    },
    {
      id: 6,
      column_1: "InstaSheet-agent1",
      for_scheduling: null,
      sales_person: null,
      sales_person_email: "carolyn.gonzalez@grouphealthvisiontrust.co",
      company: "Steve Prints",
      company_phone: "(561) 571-2903",
      phone_from_email: "none",
      lead_first_name: "Steve",
      lead_last_name: "Prints",
      lead_email: "steve@steveprints.com",
      column_2: "steve@steveprints.com",
      email_reply: "Please send a brief overview",
      phone_1: "(561) 571-2903",
      phone_number: "(561) 571-2903",
      phone_2: null,
      address: null,
      city: null,
      state: null,
      zip: null,
      details: "http://www.steveprints.com/",
      email_signature: "Please send a brief overview",
      linkedin_link: "none",
      second_contact_person_linked: "none",
      status_after_call: null,
      number_of_calls_spoken_with_leads: null,
      dropdown: null,
      isdone: false,
      created_at: "2025-10-14T17:03:30.365Z",
      updated_at: "2025-10-14T17:03:30.365Z",

      ctaText: "Encode",
      ctaLink: "https://ui.aceternity.com/templates",
      // INSTANTLY SHEET DATA FIELDS
    },
  ];

  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>

      <div className="z-40 w-9/12 relative h-screen flex justify-center items-center">
        <div className="absolute top-35 pb-20 w-full">
          <ExpandableCardsToEncode cards={toEncode} />
        </div>
      </div>
    </div>
  );
};

export default ToEncodeList;
