import React from "react";
import { NavBar } from "../components/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiOutlineMail } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";

const GetLeadDetails = () => {
  return (
    <div className="relative h-screen w-full flex justify-center items-center">
      <div className="absolute top-0 w-full container mx-auto z-50">
        <NavBar />
      </div>

      <div className="flex flex-col w-full justify-center items-center pt-40 md:pt-10 pb-10 px-4 z-40">
        <div className="w-2/6 flex justify-center flex-col gap-3">
          <div className="flex w-full items-center gap-2">
            <Input type="email" placeholder="Email" className="text-sm" />
            <Button
              type="submit"
              variant="outline"
              className="text-white text-sm"
            >
              Get Details <HiOutlineMail />
            </Button>
          </div>
          <div className="h-[200px] rounded-md p-2 border-2 bg-[#151515] relative">
            <div className=""></div>
            <div className="absolute right-2 bottom-2">
              <Button
                type="submit"
                variant="outline"
                className="text-white text-sm"
              >
                Copy <IoCopyOutline />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetLeadDetails;
