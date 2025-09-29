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
import StatusIndicator from "./custom/StatusIndicator";
import { useDispatch } from "react-redux";
import { startAgentEncoding } from "@/store/reducers/instantlyAiReducer";
import toast from "react-hot-toast";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";

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
    pageLimit: 100,
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
          <CardTitle className="text-2xl font-black ">
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
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Instantly to Google sheets
                </span>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-3 relative">
                  <Label htmlFor="">Campaign</Label>
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
                  <Label htmlFor="">Google Sheets(Destination)</Label>
                  <div className="flex justify-between gap-2">
                    <div className="w-full">
                      <SheetsComboBox
                        existingSheets={existingSheets}
                        selectedSheet={selectedSheet}
                        setSelectedSheet={setSelectedSheet}
                      />
                    </div>
                    <SheetsDrawerDialog open={open} setOpen={setOpen} />
                  </div>
                </div>

                {/* Toggle button for opts */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit px-3 mb-2 text-xs"
                  onClick={() => setShowOpts((v) => !v)}
                >
                  {showOpts ? (
                    <div className="flex justify-center items-center gap-2">
                      <h2>Hide Advanced Options</h2>
                      <FaChevronUp />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-2">
                      <h2>Show Advanced Options</h2>
                      <FaChevronDown />
                    </div>
                  )}
                </Button>
                {showOpts && (
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="pageLimit">Page Limit</Label>
                      <Input
                        id="pageLimit"
                        name="pageLimit"
                        type="number"
                        min="1"
                        defaultValue={100}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="emailsPerLead">Emails Per Lead</Label>
                      <Input
                        id="emailsPerLead"
                        name="emailsPerLead"
                        type="number"
                        min="1"
                        defaultValue={3}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="concurrency">Concurrency</Label>
                      <Input
                        id="concurrency"
                        name="concurrency"
                        type="number"
                        min="1"
                        defaultValue={3}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="maxEmails">Max Emails</Label>
                      <Input
                        id="maxEmails"
                        name="maxEmails"
                        type="number"
                        min="1"
                        defaultValue={100}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="maxPages">Max Pages</Label>
                      <Input
                        id="maxPages"
                        name="maxPages"
                        type="number"
                        min="1"
                        defaultValue={50}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="aiInterestThreshold">
                        AI Interest Threshold
                      </Label>
                      <Input
                        id="aiInterestThreshold"
                        name="aiInterestThreshold"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={1}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-base font-bold py-5 hover:cursor-pointer "
                >
                  {/* {encodingLoader ? ( */}
                  {encodingLoader ? (
                    <div className="flex justify-center items-center gap-1">
                      {/* Choose one: 'Processing Data...' or 'Encoding in Progress...' */}
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
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
