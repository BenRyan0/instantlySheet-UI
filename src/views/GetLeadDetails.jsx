import React, { useEffect, useState } from "react";
import { NavBar } from "../components/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiOutlineMail } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import {
  getLeadDetails,
  messageClear,
} from "@/store/reducers/instantlyAiReducer";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RxReset } from "react-icons/rx";

const GetLeadDetails = () => {
  const {
    successMessage,
    errorMessage,
    loader,
    leadDetails,
    errorMessageDisplay,
    type,
  } = useSelector((state) => state.instantlyAi);
  const dispatch = useDispatch();
  const [formattedDetails, setFormattedDetails] = useState("");

  const [email, setEmail] = useState("");
  const inputHandler = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    } else if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Format leadDetails whenever it changes
  useEffect(() => {
    if (!leadDetails || Object.keys(leadDetails).length === 0) {
      setFormattedDetails("");
      return;
    }

    const sender = leadDetails["Email Sender"] ?? "N/A";
    const from = leadDetails["Email From"] ?? "N/A";
    const response = leadDetails.Response ?? "N/A";

    const signature =
      leadDetails["Email Signature"]
        ?.replace(/, /g, ",\n")
        ?.replace(/ ?Mobile:/gi, "\nMobile:") || "none";

    const address = leadDetails.Address || "none";

    const phone =
      leadDetails["Phone Number"] ?? leadDetails["Phone Number:"] ?? "none";

    const website = leadDetails.Website ?? leadDetails["Website:"] ?? "none";

    const formatted = [
      `Email Sender: ${sender}`,
      `Email From: ${from}`,
      ``,
      `Response:`,
      `${response}`,
      ``,
      `Signature:`,
      `${signature}`,
      ``,
      `Address:`,
      `${address}`,
      ``,
      `Phone Number:`,
      `${phone}`,
      ``,
      `Website:`,
      `${website}`,
    ].join("\n");

    setFormattedDetails(formatted);
  }, [leadDetails]);

  const getLeadDetailsHandler = (e) => {
    e.preventDefault();
    const leadEmail = e.currentTarget.elements.email.value;

    if (!leadEmail) {
      toast.error("Please enter an email address");
      return;
    }

    dispatch(getLeadDetails({ leadEmail }));
  };

  const copyToClipboard = () => {
    if (formattedDetails) {
      navigator.clipboard.writeText(formattedDetails);
      toast.success("Lead details copied to clipboard");
    } else {
      toast.error("No lead details to copy");
    }
  };

  return (
    <div className="relative h-screen w-full flex justify-center items-start">
      <div className="absolute top-0 w-full container mx-auto z-50">
        <NavBar />
      </div>

      <div className="flex flex-col w-full justify-center items-center mt-40 md:pt-10 pb-10 px-4 z-40 ">
        <div className="w-10/12 md:w-7/12 lg:w-4/12 flex justify-center flex-col gap-3">
          <form
            onSubmit={getLeadDetailsHandler}
            className="flex w-full items-center gap-2 flex-col"
          >
            <div className="">
              <p
                className={` text-xs mb-1 ${
                  errorMessageDisplay ? "text-red-300" : "text-white"
                }`}
              >
                {/* <p className="text-white text-xs mb-1"> */}
                {errorMessageDisplay
                  ? errorMessageDisplay
                  : "Enter the lead's email address to fetch details"}
              </p>
            </div>
            <div className="flex w-full gap-2">
              <Input
                type="email"
                id="email"
                name="email"
                onChange={inputHandler}
                value={email}
                placeholder="Email"
                className="text-xs"
                disabled={loader}
              />
              <Button
                type="submit"
                variant="outline"
                className="text-white text-xs"
                disabled={loader}
              >
                {loader ? "Loading..." : "Get Details"}
                <HiOutlineMail />
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEmail("");
                  setFormattedDetails("");
                  toast.success("Form reset successfully");
                }}
                variant="outline"
                className="text-white text-xs"
                disabled={loader}
              >
                <div className="">
                  <RxReset />
                </div>
              </Button>
            </div>
          </form>
          {formattedDetails && Object.keys(leadDetails).length > 0 && (
            <div className="h-fit rounded-md px-6 py-4 border-2 bg-[#151515] relative overflow-y-auto text-white text-left text-sm whitespace-pre-wrap">
              {formattedDetails}
              <div className="absolute right-2 bottom-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="text-white text-sm"
                >
                  Copy <IoCopyOutline />
                </Button>
              </div>
            </div>
          )}

          {/* <div className="h-[400px] rounded-md p-2 border-2 bg-[#151515] relative overflow-y-auto text-white whitespace-pre-wrap text-sm">
            {formattedDetails || "No details fetched yet."}
            <div className="absolute right-2 bottom-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="text-white text-sm"
              >
                Copy <IoCopyOutline />
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default GetLeadDetails;
