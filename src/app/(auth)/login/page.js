"use client";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import {  FaGithub, FaGoogle } from "react-icons/fa6";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

export default function Component() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPass, setShowPass] = useState({pass: false})

  // Handle Login button
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    // e.target.reset()
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success("Log In Success");
      setTimeout(() => {
        router.push("/dashboard"); // ✅ redirect on success
      }, 400);
    } else {
      toast.error("Username or Password Incorrect! \nPlease Try Again");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-[calc(100vh-200px)]  pt-16">
      <ToastContainer />
      <div className="flex flex-col max-w-[480px] py-8  mx-auto gap-4 p-3 bg-gray-200 rounded-2xl">
        <h1 className="flex-center text-3xl font-bold text-shadow-lg text-white text-shadow-blue-600">
          Login To Start
        </h1>
        <form
          className="flex flex-col max-w-[400px] w-full mx-auto gap-4 p-3 bg-gray-300 rounded-2xl"
          onSubmit={handleSubmit}
        >
          <div className="email-phone w-full flex flex-col">
            <label className="text-xl font-bold" htmlFor="names">
              Username
            </label>
            <input
              className="input-style w-full"
              type="text"
              name="email"
              id="email"
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="email-phone w-full flex flex-col">
            <label className="text-xl font-bold" htmlFor="names">
              Password
            </label>
            <div className="flex-center w-full relative">
              <input
                className="input-style w-full "
                type={showPass.pass ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter Password"
                required
              />
              <button
                onClick={() =>
                  setShowPass({ ...showPass, pass: !showPass.pass })
                }
                className="absolute right-2 text-xl h-full"
                type="button"
              >
                {showPass.pass ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <button className="sec-btn w-fit px-10 m-auto" type="submit">
            Log In
          </button>
        </form>
        <div className="line h-[.5px] bg-gray-600 w-full "></div>
        <div className="otherlog w-full flex-center gap-2 flex-wrap">
          <div className="w-full flex justify-start">
            <span>
              {"Don't"} have an account?
              <Link href="/register" className="text-blue-600">
                {" "}
                Register Now
              </Link>
              <p>Or Continue With</p>{" "}
            </span>
          </div>

          <button
            className="flex-center font-bold gap-3 pri-btn"
            onClick={() => signIn("github")}
          >
            <FaGithub className="text-4xl " />{" "}
            <span className="sm:flex hidden">GitHub</span>
          </button>
          <button
            className="flex-center font-bold gap-3 pri-btn"
            onClick={() => signIn("google")}
          >
            <FaGoogle className="text-4xl " />{" "}
            <span className="sm:flex hidden">Google</span>
          </button>
          <button
            className="flex-center font-bold gap-3 pri-btn"
            onClick={() => signIn("facebook")}
          >
            <FaFacebook className="text-4xl " />{" "}
            <span className="sm:flex hidden">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
