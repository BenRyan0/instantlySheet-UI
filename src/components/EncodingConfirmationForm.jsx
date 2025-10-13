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
import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";

import { login } from "../../src/store/reducers/authReducer"; // import it
import toast from "react-hot-toast";
import { messageClear } from "../store/reducers/authReducer"; // Make sure this path is correct
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { BiSolidQuoteRight } from "react-icons/bi";
import { BiSolidMessageSquareDetail } from "react-icons/bi";

export function EncodingConfirmationForm({ className, RowData, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("toBeEncoded", RowData["Column 1"])

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(login({ Credential: { identifier: email, password } }));
    } catch (err) {
      setError(err);
    }
  };

  const { userInfo, successMessage, errorMessage, redirect } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate("/");
    }
  }, [successMessage, errorMessage, userInfo, redirect, navigate, dispatch]);

  return (
    <div className={cn("flex flex-col gap-6 w-8/12", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Encoding Confirmation</CardTitle>
          <CardDescription className="text-[10px]">
            Confirm To Add Lead reply to google sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-5 items-start text-sm">
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="bg-slate-600/20 w-full px-5 py-3 rounded-sm flex flex-col justify-center items-center gap-3 relative">
                <BiSolidQuoteLeft className="absolute top-2 left-2" size={20} />
                <BiSolidQuoteRight
                  className="absolute top-2 right-2"
                  size={20}
                />
                <div className="flex gap-2 w-11/12 text-center justify-center text-sm">
                  {RowData["email reply"]}
                </div>

                <div className="flex flex-col justify-center items-center gap-1">
                  <h2>
                    {" "}
                    - {RowData["lead first name"]} {RowData["lead last name"]}
                  </h2>
                </div>
              </div>
              <div className="bg-slate-600/20 w-full rounded-sm py-4 flex flex-col justify-center items-start text-start px-4 relative">
                <div className="absolute -top-2 right-2 bg-white text-zinc-800 px-3 rounded-xs">
                  Sales Person
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Sales person : </span>
                  <h1 className="font-light pl-1">{RowData["sales person"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Email : </span>
                  <h1 className="font-light pl-1">
                    {RowData["sales person email"]}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="bg-slate-600/20 w-full rounded-sm py-4 flex flex-col justify-center items-start text-start px-4 relative gap-1">
                <div className="absolute -top-2 right-2 bg-white text-zinc-800 px-3 rounded-xs">
                  Lead
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Company : </span>
                  <h1 className="font-light pl-1">{RowData["company"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Lead email : </span>
                  <h1 className="font-light pl-1">{RowData["lead email"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Company phone# : </span>
                  <h1 className="font-light pl-1">
                    {RowData["company phone#"]}
                  </h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Phone 1 : </span>
                  <h1 className="font-light pl-1">{RowData["phone 1"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Phone#from email: </span>
                  <h1 className="font-light pl-1">
                    {RowData["phone#from email"]}
                  </h1>
                </div>
                <div className="flex gap-2 ">
                  <div className="flex">
                    <span className="font-medium">Lead first name: </span>
                    <h1 className="font-light pl-1">
                      {RowData["lead first name"]}
                    </h1>
                  </div>
                  <div className="flex">
                    <span className="font-medium">Lead last name: </span>
                    <h1 className="font-light pl-1">
                      {RowData["lead last name"]}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="bg-slate-600/20 w-full rounded-sm py-4 flex flex-col justify-center items-start text-start px-4 relative gap-1">
                <div className="absolute -top-2 right-2 bg-white text-zinc-800 px-3 rounded-xs">
                  Lead Address
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Address : </span>
                  <h1 className="font-light pl-1">{RowData["address"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">City : </span>
                  <h1 className="font-light pl-1">{RowData["city"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">State : </span>
                  <h1 className="font-light pl-1">{RowData["state"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Zip : </span>
                  <h1 className="font-light pl-1">{RowData["zip"]}</h1>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col gap-6 text-slate-100 text-sm">
            <div className="w-full flex flex-col justify-center items-center">
              <div className="bg-slate-600/20 w-10/12 px-5 py-3 rounded-sm flex flex-col justify-center items-center gap-3 relative">
                <BiSolidQuoteLeft className="absolute top-2 left-2" size={20} />
                <BiSolidQuoteRight className="absolute top-2 right-2" size={20} />
                <div className="flex gap-2 w-11/12 text-center justify-center bg-red-800">
                  {RowData["email reply"]}Thanks for reaching out I could use funding On Oct 5, 2025, at 11:06 AM, Jessica Flores  wrote: Hi, mind a quick ask: are you the right person at ABRAHAM BALDERAS CONSTRUCTION LLC to talk about funds ready the next business day, or can you let me know who is? Quick context: our company can make funding available based on sales, and credit rating doesn't matter much.
                </div>

                <div className="flex flex-col justify-center items-center gap-1">
                  <h2>
                    {" "}
                    - {RowData["lead first name"]} {RowData["lead last name"]}
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center text-center">
              <div className="bg-slate-600/20 w-10/12 rounded-sm py-4 flex flex-col justify-center items-start text-start px-4 relative gap-1">
                <div className="absolute -top-2 right-2 bg-white text-zinc-800 px-3 rounded-xs">
                  Lead
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Company : </span>
                  <h1 className="font-light pl-1">{RowData["company"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Lead email : </span>
                  <h1 className="font-light pl-1">{RowData["lead email"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Company phone# : </span>
                  <h1 className="font-light pl-1">
                    {RowData["company phone#"]}
                  </h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Phone 1 : </span>
                  <h1 className="font-light pl-1">{RowData["phone 1"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Phone#from email: </span>
                  <h1 className="font-light pl-1">
                    {RowData["phone#from email"]}
                  </h1>
                </div>
                <div className="flex gap-2 ">
                  <div className="flex">
                    <span className="font-medium">Lead first name: </span>
                    <h1 className="font-light pl-1">
                      {RowData["lead first name"]}
                    </h1>
                  </div>
                  <div className="flex">
                    <span className="font-medium">Lead last name: </span>
                    <h1 className="font-light pl-1">
                      {RowData["lead last name"]}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center text-center">
              <div className="bg-slate-600/20 w-10/12 rounded-sm py-4 flex flex-col justify-center items-start text-start px-4 relative gap-1">
                <div className="absolute -top-2 right-2 bg-white text-zinc-800 px-3 rounded-xs">
                  Lead Address
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Address : </span>
                  <h1 className="font-light pl-1">{RowData["address"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">City : </span>
                  <h1 className="font-light pl-1">{RowData["city"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">State : </span>
                  <h1 className="font-light pl-1">{RowData["state"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Zip : </span>
                  <h1 className="font-light pl-1">{RowData["zip"]}</h1>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center text-center">
              <div className="bg-slate-600/20 w-10/12 rounded-sm py-4 flex flex-col justify-center items-start text-start px-4 relative">
                <div className="absolute -top-2 right-2 bg-white text-zinc-800 px-3 rounded-xs">
                  Sales Person
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Sales person : </span>
                  <h1 className="font-light pl-1">{RowData["sales person"]}</h1>
                </div>
                <div className="flex gap-0.5 ">
                  <span className="font-medium">Sales person Email : </span>
                  <h1 className="font-light pl-1">
                    {RowData["sales person email"]}
                  </h1>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-center gap-3 w-full px-2">
              <Button
                type="submit"
                className="w-3/12 bg-slate-100 text-gray-700 font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 rounded-xs"
              >
                Skip
              </Button>
              <Button
                type="submit"
                className="w-7/12 bg-slate-100 text-gray-700 font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 rounded-xs"
              >
                Encode
              </Button>
            </div>
          </div> */}
        </CardContent>
      </Card>
      {/* <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
