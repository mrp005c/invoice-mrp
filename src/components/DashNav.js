"use client";
import React, { lazy, useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Modal from "./MotionModel";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";
import { ToastContainer, toast } from "react-toastify";

const DashNav = () => {
  const { data: session, status } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [formInfo, setFormInfo] = useState({
    name: "",
    phone: "",
    image: "",
    birth_date: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    if (formData.get("password") !== formData.get("confirm_password")) {
      toast.error("Password Didn't match");
      return;
    }
    setIsLoading(true);
    // e.target.reset()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: session.user.id,
      ...formInfo,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const fetchUrl = `/api/user/update?email=${session.user.email}`;
      const a = await fetch(fetchUrl, requestOptions);
      const res = await a.json();
      if (res.success) {
        toast.success(res.message);
        setDropdown(() => false);
        setFormInfo({
          name: "",
          phone: "",
          image: "",
          birth_date: "",
          address: "",
          password: "",
        });
        router.push("/dashboard?tab=edited");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log({ "Error Occured": error });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // Or a spinner
  }
  if (status === "authenticated") {
    return (
      <>
        <ToastContainer className="fixed z-50" />
        <Loading yes={isLoading} />
        <Modal
          isOpen={dropdown}
          onClose={() => {
            return (
              router.push("/dashboard?tab=profile"), setDropdown(() => false)
            );
          }}
        >
          <form
            className="flex flex-col max-w-[600px] mx-auto gap-4 p-2 md:p-3"
            onSubmit={handleSubmit}
          >
            <h2 className="text-3xl flex-center font-bold">Edit Profile</h2>
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
                  onChange={handleChange}
                  value={formInfo.name || ""}
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
                  value={session.user.email || ""}
                  disabled
                  placeholder="Enter Email"
                />
                <input
                  className="input-style "
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter Phone No."
                  onChange={handleChange}
                  value={formInfo.phone || ""}
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
                  onChange={handleChange}
                  value={formInfo.birth_date || ""}
                />
                <input
                  className="input-style "
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter Address"
                  onChange={handleChange}
                  value={formInfo.address || ""}
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
                  onChange={handleChange}
                  value={formInfo.image || ""}
                />
              </div>
            </div>
            <div className="email-phone w-full">
              <label className="text-xl font-bold" htmlFor="names">
                Change Password
              </label>
              <div className="flex pl-3 gap-2 flex-col min-[400px]:flex-row">
                <input
                  className="input-style "
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  value={formInfo.password || ""}
                />
                <input
                  className="input-style "
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <div className="buttons flex">
              <button
                className="sec-btn bg-violet-200 hover:bg-violet-400  active:bg-violet-600 text-black w-fit px-10 m-auto ring-2 ring-black"
                type="submit"
              >
                Submit
              </button>
              <button
                onClick={() => setDropdown(false)}
                className="sec-btn ring-2 ring-black bg-gray-200 text-black hover:bg-red-600  active:bg-red-800 w-fit px-10 m-auto"
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        <div className="text-lg flex flex-col container mx-auto gap-4">
          <h2 className="text-3xl py-4 font-bold">{"Dashboard"}</h2>

          <div className="w-full bg-gray-100 flex-between flex-col gap-3 md:flex-row rounded-2xl p-3">
            <div className=" flex-between flex-1 gap-3 h-fit w-full md:w-fit p-2 rounded-2xl">
              <Image
                height={100}
                width={100}
                className=" rounded-full object-cover bg-cover h-[100px] w-[100px]"
                priority={lazy}
                src={session.user.image || "/user.jpg"}
                alt="profile pic"
              />
              <div className="names h-full flex-between items-start flex-col md:flex-1 w-fit  overflow-hidden overflow-ellipsis">
                <span className="text-2xl overflow-ellipsis flex flex-1 overflow-hidden font-bold">
                  {session.user.name}
                </span>
                <span className="text-lg overflow-ellipsis flex flex-1 overflow-hidden">
                  {session.user.email}
                </span>
              </div>
            </div>
            <div className="buttons flex-center flex-wrap gap-1 md:gap-3">
              <button
                className="prim-btn"
                onClick={() => setDropdown((e) => !e)}
              >
                Edit Profile
              </button>
              <button className="prim-btn" onClick={() => signOut()}>
                Log Out
              </button>
              <button className="prim-btn bg-inherit hover:bg-red-400 active:bg-red-800 text-[#cb1414d5]">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default DashNav;
