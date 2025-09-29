"use client";

import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdAdd } from "react-icons/io";
import { SiGooglesheets } from "react-icons/si";
import { X } from "lucide-react";

import { AddNewSheet, messageClear } from "@/store/reducers/sheetReducer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ColumnKanban } from './custom/ColumnKanban';

export function SheetsDrawerDialog({ open, setOpen }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");






  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <IoMdAdd /> New Sheet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[530px] z-50">
          <DialogHeader>
            <DialogTitle>Add New Sheet</DialogTitle>
            <DialogDescription>
              Enter details to create a new sheet that you can use later
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add New Sheet</Button>
      </DrawerTrigger>
      <DrawerContent className={"lg:px-10 px-5"}>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Sheet</DrawerTitle>
          <DrawerDescription>
            Enter details to create a new sheet that you can use later
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4 overflow-y-scroll" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }) {
  const defaultTags = [
    "Column 1",
    "For scheduling",
    "sales person",
    "sales person email",
    "company",
    "company phone#",
    "phone#from email",
    "lead first name",
    "lead last name",
    "lead email",
    "Column 1",
    "email reply",
    "phone 1",
    "phone2",
    "address",
    "city",
    "state",
    "zip",
    "details",
    "Email Signature",
    "linkedin link",
    "2nd contact person linked",
    "status after the call",
    "number of calls spoken with the leads",
    "@dropdown",
    "number of calls spoken with the leads",
  ];


  const [sheetName, SetSheetName] = useState("")
  const [tags, setTags] = React.useState(defaultTags);
  const [tagInput, setTagInput] = React.useState("");
  const dispatch = useDispatch();


  console.log(sheetName)
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!e.target.sheetName.value && tags){
      toast.error("All Feilds Are Required")
      messageClear()
      return
    }

    dispatch(AddNewSheet({sheetName: e.target.sheetName.value, columns: tags, sheetID : import.meta.env.VITE_SHEET_ID }))    
  };



     const {loader, successMessage } = useSelector((state) => state.sheet);

     useEffect(()=>{
      if(successMessage){
        SetSheetName("")
        setTags([])
      }
     })


  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6 ", className)}
    >
      {/* Sheet Name */}
      <div className="grid gap-3 ">
        <Label htmlFor="sheetName">Sheet Name</Label>
        <Input id="sheetName" value={sheetName} onChange={(e)=>SetSheetName(e.target.value)} placeholder="Sheet Name" />
      </div>

      {/* Multiple Words Input */}
      <div className="grid gap-3">
        <Label htmlFor="words">Sheet Columns</Label>
        <div className="flex gap-2">
          <Input
            id="words"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            placeholder="Column name"
          />

          <Button variant="secondary" onClick={() => setTags([])} type="button">
            Reset
          </Button>
          <Button variant="secondary" onClick={() => setTags(defaultTags)} type="button">
            Default
          </Button>
          <Button variant="secondary" onClick={handleAddTag} type="button">
            Add
          </Button>
        </div>

        {/* Tag Display */}
        <div className="flex flex-wrap justify-center gap-2 mt-1 text-zinc-800  max-h-[200px] overflow-y-scroll py-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 rounded-sm bg-gray-200 px-2 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                <X size={17} />
              </button>
            </span>
          ))}
        </div>
      </div>
{/* 
      <div className="w-full h-screen flex justify-center items-center bg-red-800">
        <ColumnKanban/>
      </div> */}

      {/* Submit */}
      <Button disabled={loader} type="submit">
        {
          loader ? <div className="">Loading ...</div> : <div className="flex justify-center items-center"> Add Sheet <SiGooglesheets /></div>
        }
       
      </Button>
    </form>
  );
}
