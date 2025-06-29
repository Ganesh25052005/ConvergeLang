import React, { useState } from "react";

import { Waypoints, Mail, Eye, EyeOff, Lock } from "lucide-react";
import { Link } from "react-router";

import useLoginHook from "../hooks/useLoginHook.js";
import axiosInstance from "../lib/axios.js";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [googlebtn,setGooglebtn] = useState(false);

  const {isPending,error,signInMutation} = useLoginHook();

  const handleSignUp = (e) => {
    e.preventDefault();
    signInMutation(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row bg-base-100 w-full rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
        {/* Left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col  ">
          <div className="mb-4 flex gap-4 items-center justify-start">
            <Waypoints className="size-9 text-primary" />
            <span className="text-3xl font-bold font-Titillium+Web bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
              ConvergeLang
            </span>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="alert alert-error mb-2">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full ">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey
                  </p>
                </div>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="form-control w-full">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="size-5 text-base-content/75" />
                      </div>
                      <input
                        type="text"
                        placeholder="Email address"
                        value={formData.email}
                        className="input input-bordered w-full pl-10"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  {/* Password */}
                  <div className="form-control w-full">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="size-5 text-base-content/75" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        className="input input-bordered w-full px-10"
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-5 text-base-content/75" />
                        ) : (
                          <Eye className="size-5 text-base-content/75" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      <span className="font-bold">Signing in...</span>
                    </>
                  ) : (
                    <span className="font-bold">Sign in</span>
                  )}
                </button>
                <div className="text-center">
                  <p className="text-sm"> 
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                       Create one
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div>
            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 font-medium">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button className="btn btn-secondary w-full flex gap-3" type="button"
            disabled={googlebtn}
            onClick={()=>{
              setGooglebtn(true);
              const oauthUrl = `${axiosInstance.defaults.baseURL}/auth/oauth`;
              window.location.href = oauthUrl;
            }}>
            <img src="/ggSvg.svg" alt="Google" className="size-6" />
            {
              !googlebtn ? (<span className="font-bold">Sign in with Google</span>)
              :(<span className="font-bold">Loading...</span>)
            }
            </button>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/start.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
