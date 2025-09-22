"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";


const Navbar = () => {
  const [navP, setNavP] = useState(false);
  const { data: session } = useSession();
  const [show, setShow] = useState(true);
  const pathname = usePathname();
  const params = useParams();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensures client-only rendering
  }, []);

  useEffect(() => {
    setNavP(false);
  }, [pathname, params]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!mounted) return null; // prevents mismatch

  return (
    <>
    <header
      className={`shadow-md transition-transform duration-400 z-50 ${
        show ? "translate-y-0" : "-translate-y-[100%]"
      } flex-center h-16 w-full px-1 md:px-3 bg-sec-white fixed top-0`}
    >
      {/* mobile nav */}
      <div
        className={`${
          navP ? "top-[110%]" : "bottom-[110%]"
        } absolute right-2 flex transition-all duration-300 flex-col justify-start items-center gap-1 bg-gray-200 p-2 sm:hidden`}
      >
        <Link className="nav-link w-full" href="/">Home</Link>
        <Link className="nav-link w-full" href="/about">About</Link>
        <Link className="nav-link w-full" href="/contact">Contact</Link>
        <Link className="nav-link w-full" href="/#invoices">Get Started</Link>
      </div>

      {/* main bar */}
      <div className="flex-between w-full">
        <Link
          href="/"
          className="log text-3xl flex-center relative z-10 text-blue-600"
        >
          <FaFileInvoiceDollar className="text-4xl" />
          <span className="hidden md:flex font-bold">Invoice MRP</span>
        </Link>
        <div className="buttons flex-between gap-2 md:gap-3 md:text-lg">
          {!session ? (
            <>
              <Link href="/login" className="pri-btn md:sec-btn bg-blue-600 hover:bg-blue-800">
                Log In
              </Link>
              <Link href="/register" className="pri-btn md:sec-btn bg-sec-gray hover:bg-sec-black">
                Sign Up
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="pri-btn md:sec-btn bg-purple-400 hover:bg-purple-500">
              Profile
            </Link>
          )}
          <button
            onClick={() => setNavP((e) => !e)}
            className="sm:hidden flex pri-btn bg-sec-gray"
          >
            <IoMenu />
          </button>
        </div>
      </div>

      {/* desktop nav */}
      <nav className="absolute hidden sm:flex flex-between gap-1 md:gap-2 lg:gap-3">
        <Link className="nav-link w-fit" href="/">Home</Link>
        <Link className="nav-link w-fit" href="/about">About</Link>
        <Link className="nav-link w-fit" href="/contact">Contact</Link>
      </nav>
    </header>
    
    </>
  );
};

export default Navbar;
