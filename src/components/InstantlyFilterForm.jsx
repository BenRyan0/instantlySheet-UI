import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CampaignComboBox } from "./CampaignComboBox";
import { SheetsComboBox } from "./SheetsComboBox";
import { SheetsDrawerDialog } from "./SheetsDrawerDialog"; // adjust path if needed
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { startAgentEncoding } from "@/store/reducers/instantlyAiReducer";
import toast from "react-hot-toast";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
// import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InstantlyFilterForm({
  className,
  existingSheets,
  existingCampaigns,
  instantlyloader,
  encodingLoader,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [loader, setLoader] = useState(true);
  const [openCampaign, setOpenCampaign] = useState(false);
  const [showOpts, setShowOpts] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Default opts values
  const defaultOpts = {
    pageLimit: 10,
    emailsPerLead: 3,
    concurrency: 3,
    maxEmails: 100,
    maxPages: 50,
    aiInterestThreshold: 1,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (
      !selectedIds ||
      !Array.isArray(selectedIds) ||
      selectedIds.length === 0
    ) {
      toast.error("Please select at least one campaign.");
      return;
    }
    if (
      !selectedSheet ||
      typeof selectedSheet !== "string" ||
      selectedSheet.trim() === ""
    ) {
      toast.error("Please select a Google Sheet destination.");
      return;
    }

    const form = e.target;
    const opts = {
      pageLimit: Number(form.pageLimit?.value || defaultOpts.pageLimit),
      emailsPerLead: Number(
        form.emailsPerLead?.value || defaultOpts.emailsPerLead
      ),
      concurrency: Number(form.concurrency?.value || defaultOpts.concurrency),
      maxEmails: Number(form.maxEmails?.value || defaultOpts.maxEmails),
      maxPages: Number(form.maxPages?.value || defaultOpts.maxPages),
      aiInterestThreshold: Number(
        form.aiInterestThreshold?.value || defaultOpts.aiInterestThreshold
      ),
    };
    const data = {
      campaignId: selectedIds,
      sheetName: selectedSheet,
      opts,
    };
    dispatch(startAgentEncoding(data));
    // You can replace the above with any further handling (API call, etc)
  };

  return (
    <div
      className={cn("flex flex-col items-center gap-6", className)}
      {...props}
    >
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black">
            <div className="w-full relative flex justify-center items-end">
              <img className="w-9" src="images/logo.png" alt="" />

              <h2 className="text-2xl">
                Insta<span className="italic pr-1">Sheet </span>{" "}
              </h2>
            </div>
          </CardTitle>
          <CardDescription className={"text-xs"}>
            Add filters for migration (instantly.ai - sheets)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Instantly.ai - Google Sheets
                </span>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-3 relative">
                  <Label htmlFor="">Campaign/s</Label>
                  <CampaignComboBox
                    existingCampaigns={existingCampaigns}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    instantlyloader={instantlyloader}
                    openCampaign={openCampaign}
                    setOpenCampaign={setOpenCampaign}
                  />
                </div>
                <div className="grid gap-3 ">
                  <Label htmlFor="">Google Sheet(Destination)</Label>
                  <div className="flex justify-between gap-2">
                    <div className="w-full">
                      <SheetsComboBox
                        existingSheets={existingSheets}
                        selectedSheet={selectedSheet}
                        setSelectedSheet={setSelectedSheet}
                      />
                    </div>
                    <div className="relative">
                      <SheetsDrawerDialog open={open} setOpen={setOpen} />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit px-3 mb-2 text-xs"
                  onClick={() => setShowOpts((v) => !v)}
                >
                  {showOpts ? (
                    <div className="flex justify-center items-center gap-2">
                      <h2>Hide Advanced Options</h2>
                      <FaChevronUp size={20} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-2">
                      <h2>Show Advanced Options</h2>
                      <FaChevronDown size={10} />
                    </div>
                  )}
                </Button>
                {showOpts && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1, y: -30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 50 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-3 justify-between items-end gap-4 mb-2 rounded-md p-5"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 1, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 50 }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col gap-1.5"
                    >
                      <Label htmlFor="pageLimit" className={"text-[12px]"}>
                        Page Limit
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <FaInfoCircle />
                          </TooltipTrigger>
                          <TooltipContent
                            className={"bg-[#212121] text-white fill-[#212121]"}
                          >
                            <p className="text-[9px]">
                              limit of pages to be fetched
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="pageLimit"
                        name="pageLimit"
                        type="number"
                        min="1"
                        defaultValue={10}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 1, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 50 }}
                      transition={{ duration: 0.7 }}
                      className="flex flex-col gap-1.5"
                    >
                      <Label htmlFor="emailsPerLead" className={"text-[12px]"}>
                        Emails Per Lead{" "}
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <FaInfoCircle />
                          </TooltipTrigger>
                          <TooltipContent
                            className={"bg-[#212121] text-white fill-[#212121]"}
                          >
                            <p className="text-[9px]">
                              Number of emails to be collected for each lead
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="emailsPerLead"
                        name="emailsPerLead"
                        type="number"
                        min="1"
                        defaultValue={3}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 1, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 50 }}
                      transition={{ duration: 0.8 }}
                      className="flex flex-col gap-1.5"
                    >
                      <Label htmlFor="concurrency" className={"text-[12px]"}>
                        Concurrency
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <FaInfoCircle />
                          </TooltipTrigger>
                          <TooltipContent
                            className={"bg-[#212121] text-white fill-[#212121]"}
                          >
                            <p className="text-[9px]">
                              Number of emails to be fetch for each request
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="concurrency"
                        name="concurrency"
                        type="number"
                        min="1"
                        defaultValue={3}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 1, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 50 }}
                      transition={{ duration: 0.9 }}
                      className="flex flex-col gap-1.5"
                    >
                      <Label htmlFor="maxEmails" className={"text-[12px]"}>
                        Max Emails
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <FaInfoCircle />
                          </TooltipTrigger>
                          <TooltipContent
                            className={"bg-[#212121] text-white fill-[#212121]"}
                          >
                            <p className="text-[9px]">
                              Maximum emails to be processed
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="maxEmails"
                        name="maxEmails"
                        type="number"
                        min="1"
                        defaultValue={200}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 1, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 50 }}
                      transition={{ duration: 0.9 }}
                      className="flex flex-col gap-1.5"
                    >
                      <Label htmlFor="maxPages" className={"text-[12px]"}>
                        Max Pages
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <FaInfoCircle />
                          </TooltipTrigger>
                          <TooltipContent
                            className={"bg-[#212121] text-white fill-[#212121]"}
                          >
                            <p className="text-[9px]">
                              Maximum pages to be fetched
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="maxPages"
                        name="maxPages"
                        type="number"
                        min="1"
                        defaultValue={10}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 1, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 50 }}
                      transition={{ duration: 1 }}
                      className="flex flex-col gap-1.5"
                    >
                      <Label
                        htmlFor="aiInterestThreshold"
                        className={"text-[12px]"}
                      >
                        Ai Threshold
                         <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <FaInfoCircle />
                          </TooltipTrigger>
                          <TooltipContent className={"bg-[#212121] text-white fill-[#212121]"}>
                            <p className="text-[9px]">Ai threshold filter(instantly.ai)</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="aiInterestThreshold"
                        name="aiInterestThreshold"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={1}
                      />
                    </motion.div>
                  </motion.div>
                )}
                <Button
                  type="submit"
                  className="w-full text-base font-bold py-5 hover:cursor-pointer"
                >
                  {encodingLoader ? (
                    <div className="flex justify-center items-center gap-1">
                      Encoding in Progress...
                      <lord-icon
                        src="https://cdn.lordicon.com/aceczzap.json"
                        trigger="loop"
                        delay="2000"
                        colors="primary:#171717"
                        style={{ width: "30px", height: "30px" }}
                      ></lord-icon>
                    </div>
                  ) : (
                    <div className="font-bold italic flex justify-center items-center gap-1 group text-sm">
                      Fetch and Encode Data
                      <span className="group-hover:translate-x-1.5 transition-all duration-300 ease-in-out">
                        <FaChevronRight />
                      </span>
                    </div>
                  )}
                </Button>
                <Tooltip id="my-tooltip" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
