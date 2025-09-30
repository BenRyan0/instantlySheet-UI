"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

export function SheetsComboBox({
  existingSheets,
  selectedSheet,
  setSelectedSheet,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSheet || "Select sheet..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="w-full p-0"
        forceMount
      >
        <Command>
          <CommandInput placeholder="Search sheet..." className="h-9" />
          <CommandList>
            <CommandEmpty>No sheet found.</CommandEmpty>
            <CommandGroup>
              {existingSheets.map((sheet) => (
                <CommandItem
                  key={sheet}
                  value={sheet}
                  onSelect={(currentValue) => {
                    setSelectedSheet(
                      currentValue === selectedSheet ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {sheet}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedSheet === sheet ? "opacity-100" : "opacity-0"
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
