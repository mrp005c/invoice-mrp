"use client";
import Link from "next/link";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import React from "react";
import { ToastContainer, toast } from "react-toastify";

const CFooter = () => {
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: formData.get("subscribe"),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const a = await fetch("/api/user/subscriber", requestOptions);
      const res = await a.json();
      if (res.success) {
        toast.success(res.message);
        e.target.reset();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log({ "Error Occured": error });
    }
  };

  return (
    <footer className="text-gray-600 bg-sec-white body-font relative z-40">
      <ToastContainer className="fixed z-50 mt-16 " />
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-between flex-wrap md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Quick Access Links
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:font-semibold active:bg-violet-400 hover:bg-violet-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:font-semibold active:bg-violet-400 hover:bg-violet-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:font-semibold active:bg-violet-400 hover:bg-violet-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/#invoice"
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:font-semibold active:bg-violet-400 hover:bg-violet-200"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-lg hover:font-semibold active:bg-violet-400 hover:bg-violet-200"
                >
                  Profile
                </Link>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              SUBSCRIBE
            </h2>
            <form
              onSubmit={handleSubscribe}
              className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start"
            >
              <div className="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                <label
                  htmlFor="femail"
                  className="leading-7 text-sm text-gray-600"
                >
                  Enter Your Email
                </label>
                <input
                  type="email"
                  id="femail"
                  name="subscribe"
                  placeholder="Enter Email"
                  required
                  className="w-full input-style bg-gray-100 focus:bg-gray-50 text-base outline-none text-gray-700 py-1 px-3 leading-8 placeholder:text-gray-500"
                />
              </div>
              <button
                type="submit"
                className="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 active:bg-indigo-800 rounded"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-2 md:text-left text-center">
              Bitters chicharrones fanny pack
              <br className="lg:block hidden" />
              waistcoat green juice
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-200">
        <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
          <Link
            href="/"
            className="flex title-font text-sec-blue text-3xl flex-center relative z-10 font-medium items-center md:justify-start justify-center "
          >
            <FaFileInvoiceDollar />
            <span className="ml-3 text-xl font-bold">Invoice MRP</span>
          </Link>
          <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">
            &copy; {new Date().getFullYear()} Invoice MRP —
            <Link
              href="/"
              rel="noopener noreferrer"
              className="text-gray-600 ml-1"
              target="_blank"
            >
              @muhammadrakib
            </Link>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <Link href="/" className="text-gray-500">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </Link>
            <Link href="/" className="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </Link>
            <Link href="/" className="ml-3 text-gray-500">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </Link>
            <Link href="/" className="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                ></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default CFooter;
