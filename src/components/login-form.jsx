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
import { login, messageClear } from "@/store/reducers/authReducer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");

  const { userInfo, successMessage, errorMessage, loading } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ Credential: { identifier, password } }));
  };

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
  }, [successMessage, errorMessage, userInfo, navigate, dispatch]);

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex justify-start items-end">
        <img src="/images/logo.png" className="h-4 mb-0.5" alt="" />
        <h2 className="font-bold text-xs">
          insta<span className="italic">Sheet</span>
        </h2>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Welcome back</CardTitle>
          <CardDescription className="text-xs">
            Login with your email or username
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6 text-slate-100">
              {/* Identifier (Email or Username) */}
              <div className="grid gap-3">
                <Label htmlFor="identifier">Email or Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  className="text-sm"
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="e.g. user123 or user@email.com"
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 focus:outline-none pr-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full font-bold transition-all duration-300",
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-slate-100 text-gray-700 hover:bg-[#1CA261] hover:text-white"
                  )}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
