"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { FaClock } from "react-icons/fa";
import { FcDataSheet } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { SlGraph } from "react-icons/sl";
import { TbBrandDatabricks } from "react-icons/tb";
import { IoMdExit } from "react-icons/io";
import { VscServerProcess } from "react-icons/vsc";
import { RiRobot2Fill } from "react-icons/ri";
import { userLogout } from "@/store/reducers/authReducer";

export function NavBar() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch= useDispatch()

  

  return (
    <div className="relative w-full pt-4">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="">
            {/* <div className="flex justify-center items-center gap-1">
              <span className="text-sm font-bold">{userInfo?.username}</span>
              <FaRegUserCircle size={24}/>
            </div> */}
            <ButtonGroup>
              <Button variant="outline" className="w-[110px]">
                <span className="text-sm font-bold">{userInfo?.username}</span>
                <FaRegUserCircle size={24} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="!pl-2">
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="[--radius:1rem]">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                     <RiRobot2Fill />
                      <a href="/">Agent</a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <TbBrandDatabricks />
                      <a href="/logs">Encoding logs</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SlGraph />
                      <a href="/dashboard">Data Trend</a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <IoMdExit />
                      <button onClick={()=>dispatch(userLogout())}>Log out</button>
                      {/* <a href="/dashboard">Log out</a> */}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* <DummyContent /> */}
      {/* Navbar */}
    </div>
  );
}

const DummyContent = () => {
  return (
    <div className=""></div>
    // <div className="container mx-auto p-8 pt-24">
    //   <h1 className="mb-4 text-center text-3xl font-bold">
    //     Check the navbar at the top of the container
    //   </h1>
    //   <p className="mb-10 text-center text-sm text-zinc-500">
    //     For demo purpose we have kept the position as{" "}
    //     <span className="font-medium">Sticky</span>. Keep in mind that this
    //     component is <span className="font-medium">fixed</span> and will not
    //     move when scrolling.
    //   </p>
    //   <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
    //     {[
    //       {
    //         id: 1,
    //         title: "The",
    //         width: "md:col-span-1",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 2,
    //         title: "First",
    //         width: "md:col-span-2",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 3,
    //         title: "Rule",
    //         width: "md:col-span-1",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 4,
    //         title: "Of",
    //         width: "md:col-span-3",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 5,
    //         title: "F",
    //         width: "md:col-span-1",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 6,
    //         title: "Club",
    //         width: "md:col-span-2",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 7,
    //         title: "Is",
    //         width: "md:col-span-2",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 8,
    //         title: "You",
    //         width: "md:col-span-1",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 9,
    //         title: "Do NOT TALK about",
    //         width: "md:col-span-2",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //       {
    //         id: 10,
    //         title: "F Club",
    //         width: "md:col-span-1",
    //         height: "h-60",
    //         bg: "bg-neutral-100 dark:bg-neutral-800",
    //       },
    //     ].map((box) => (
    //       <div
    //         key={box.id}
    //         className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}>
    //         <h2 className="text-xl font-medium">{box.title}</h2>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
};
