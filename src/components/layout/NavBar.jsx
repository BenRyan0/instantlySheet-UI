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
import { RiListCheck2 } from "react-icons/ri";
import { FaListAlt } from "react-icons/fa";

import { userLogout } from "@/store/reducers/authReducer";

export function NavBar() {
  const navItems = [
    {
      name: "Agent",
      link: "/",
    },
    {
      name: "Encoding logs",
      link: "/logs",
    },
    {
      name: "Data trend",
      link: "/dashboard",
    },
  ];

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="relative w-full pt-4">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="">
            <ButtonGroup>
              <Button variant="outline" className="w-fit">
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
                    {/* <DropdownMenuSeparator /> */}
                    {/* <DropdownMenuItem>
                      <FaListAlt />
                      <a href="/to-encode">To Encode</a>
                    </DropdownMenuItem> */}
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
                      <button onClick={() => dispatch(userLogout())}>
                        Log out
                      </button>
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
                className="w-fit px-10 flex justify-center items-center gap-1"
              >
                <button onClick={() => dispatch(userLogout())}>Log out</button>
                <IoMdExit size={20} />
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
