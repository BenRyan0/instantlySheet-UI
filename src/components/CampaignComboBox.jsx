"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Filter } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { BarLoader } from "react-spinners";
import StatusIndicator from "./custom/StatusIndicator";

// Status map from your earlier definition
const statusMap = {
  0: { label: "Draft" },
  1: { label: "Active" },
  2: { label: "Paused" },
  3: { label: "Completed" },
  4: { label: "Running Subsequences" },
  "-99": { label: "Account Suspended" },
  "-1": { label: "Accounts Unhealthy" },
  "-2": { label: "Bounce Protect" },
};

export function CampaignComboBox({
  existingCampaigns,
  onSelectCampaigns,
  selectedIds,
  setSelectedIds,
  instantlyloader,
  openCampaign,
  setOpenCampaign,
}) {
  const [statusFilter, setStatusFilter] = React.useState("all");

  const handleSelect = (id) => {
    let newSelected;
    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter((sid) => sid !== id);
    } else {
      newSelected = [...selectedIds, id];
    }
    setSelectedIds(newSelected);
    if (onSelectCampaigns) {
      onSelectCampaigns(newSelected);
    }
  };

  const buttonLabel =
    selectedIds.length === 0
      ? "Select campaigns..."
      : `${selectedIds.length} campaign(s) selected`;

  // filter campaigns by status
  const filteredCampaigns =
    statusFilter === "all"
      ? existingCampaigns
      : existingCampaigns.filter(
          (c) => String(c.status) === String(statusFilter)
        );

  return (
    <Popover open={openCampaign} onOpenChange={setOpenCampaign}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCampaign}
          className="w-full justify-between"
        >
          {buttonLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="min-w-[250px] md:w-[450px] p-1"
      >
        <Command>
          <div className="flex flex-col lg:flex-row ">
            <CommandInput
              placeholder="Search campaigns..."
              className="h-9 sm:w-full"
            />
            <div className="flex gap-2 p-1 items-center text-sm text-gray-600 ">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm outline-0 w-full"
              >
                <option value="all">All statuses</option>
                {Object.entries(statusMap).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                    (status: {key})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* status filter row */}

          <CommandList>
            <CommandEmpty>
              <div className="min-w-[250px] md:w-[450px] flex justify-center items-center flex-col gap-[2px]">
                <p>loading</p>
                {instantlyloader ? (
                  <BarLoader
                    color="#fff"
                    height={3}
                    speedMultiplier={0.5}
                    width={47}
                  />
                ) : (
                  "No campaigns found."
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {/* <div className=" text-xs flex flex-wrap justify-center gap-2 py-2 ">
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={0} />
                  <p>Draft</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={1} />
                  <p>active</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={2} />
                  <p>Paused</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={3} />
                  <p>Completed</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={4} />
                  <p>Running Subsequences</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={-99} />
                  <p>Account Suspended</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={-1} />
                  <p>Accounts Unhealthy</p>
                </div>
                <div className="flex justify-center items-center gap-1 text-center">
                  <StatusIndicator status={-2} />
                  <p>Bounce Protect</p>
                </div>
              </div> */}

              {filteredCampaigns.map((campaign) => (
                <CommandItem
                  key={campaign.id}
                  value={campaign.name}
                  onSelect={() => handleSelect(campaign.id)}
                >
                  <div className="mr-2">
                    <StatusIndicator status={campaign.status} />
                  </div>
                  {campaign.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedIds.includes(campaign.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
