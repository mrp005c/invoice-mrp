"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState({ pass: false, confirm: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (formData.get("password") !== formData.get("confirm_password")) {
      toast.error("Password Didn't match");
      return;
    }
    // e.target.reset()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      image: formData.get("image"),
      birth_date: formData.get("birth_date"),
      address: formData.get("address"),
      password: formData.get("password"),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const a = await fetch("/api/user", requestOptions);
      const res = await a.json();
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => {
          router.push("/login");
        }, 600);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log({ "Error Occured": error });
    }
  };

  return (
    <div className="  pt-16">
      <ToastContainer className="fixed z-50 "/>
      <form
        className="flex flex-col max-w-[600px] mx-auto gap-4 rounded-2xl p-2 lg:p-4 md:p-3 bg-gray-100 "
        onSubmit={handleSubmit}
      >
        <h1 className="flex-center text-3xl font-bold text-shadow-lg text-white text-shadow-blue-600 p-2">
          Sign Up Now
        </h1>
        <div className="names w-full">
          <label className="text-xl font-bold" htmlFor="names">
            Your Name
          </label>
          <div className="flex pl-3 gap-2 flex-col min-[400px]:flex-row">
            <input
              className="input-style "
              type="text"
              name="name"
              id="name "
              placeholder="Enter First Name"
              required
            />
          </div>
        </div>

        <div className="email-phone  w-full">
          <label className="text-xl font-bold" htmlFor="names">
            Email & Phone
          </label>
          <div className="flex pl-3 gap-2 flex-col min-[400px]:flex-row">
            <input
              className="input-style "
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              required
            />
            <input
              className="input-style "
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter Phone No."
            />
          </div>
        </div>
        <div className="birth-address  w-full">
          <label className="text-xl font-bold" htmlFor="names">
            Birth Date & Address
          </label>
          <div className="flex pl-3 gap-2 flex-col min-[400px]:flex-row">
            <input
              className="input-style "
              type="date"
              // min="01/01/1950" max={new Date().toLocaleDateString()}
              min="2000-01-01"
              max={new Date().toISOString().split("T")[0]}
              name="birth_date"
              id="birth_date"
              placeholder="Enter Birth Date"
              required
            />
            <input
              className="input-style "
              type="text"
              name="address"
              id="address"
              placeholder="Enter Address"
            />
          </div>
        </div>
        <div className="birth-address  w-full">
          <label className="text-xl font-bold" htmlFor="names">
            Image
          </label>
          <div className="flex pl-3 gap-2 flex-col min-[400px]:flex-row">
            <input
              className="input-style w-full"
              type="text"
              name="image"
              id="image"
              placeholder="Enter Image Link"
            />
          </div>
        </div>
        <div className="email-phone w-full">
          <label className="text-xl font-bold" htmlFor="names">
            Password
          </label>
          <div className="flex pl-3 gap-2 flex-col min-[400px]:flex-row">
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
            <div className="flex-center w-full relative">
              <input
                className="input-style w-full "
                type={showPass.confirm ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                placeholder="Confirm Password"
                required
              />
              <button
                onClick={() =>
                  setShowPass({ ...showPass, confirm: !showPass.confirm })
                }
                className="absolute right-2 text-xl h-full"
                type="button"
              >
                {showPass.confirm ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
        </div>
        <button className="sec-btn w-fit px-10 m-auto" type="submit">
          Sign Up
        </button>
      <div className="already">
        <span>
          Already have an account?{" "}
          <Link href="/login" className="link text-blue-600">
            Log In
          </Link>
        </span>
      </div>
      </form>
      {/* if already have an account */}
    </div>
  );
};

export default Page;
