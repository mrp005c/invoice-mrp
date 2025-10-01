"use client";
import Loading from "@/components/Loading";
import Image from "next/image";
import React, { useState } from "react";
import { FaTruckLoading } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { RiDeleteBin6Fill, RiEdit2Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";

const Page = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 0.4 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, and WEBP files are allowed.";
    }
    if (file.size > maxSize) {
      return "File size must be less than 400kb.";
    }
    return null;
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
    } else {
      setError("");
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUrl(data.url);
    setIsLoading(false);
  };

  const item = {
    _id: {
      $oid: "68ce646a2c1dc0900e9ec9d7",
    },
    invoiceId: "99c613a4-7c97-49c6-8888-0ed95ad35efc",
    full_name: "Md. Rakib Patoyari",
    email: "mrp005c@gmail.com",
    phone: "01756535801",
    date: "2025-09-20",
    address: "Natore",
    paid: true,
    products: [
      {
        product: "Lenove L22-i monitor ",
        quantity: "12",
        amount: "10700",
      },
      {
        product: "Mouse",
        quantity: "12",
        amount: "540",
      },
      {
        product: "keyboard rmx22",
        quantity: "12",
        amount: "900",
      },
    ],
    createdAt: 1758356586702,
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const a = await fetch("/api/user/contact", requestOptions);
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
    <>
      <Loading yes={isLoading} />
      <ToastContainer className="fixed z-50" />
      <section className="body-font relative text-gray-600">
        <div className="container mx-auto flex flex-wrap px-5 py-24 sm:flex-nowrap">
          <div className="relative flex items-end justify-start overflow-hidden rounded-lg bg-gray-300 p-10 sm:mr-10 md:w-1/2 lg:w-2/3">
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              frameBorder="0"
              title="map"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7059.686577090391!2d88.95944600867372!3d24.406492353514384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1758426032579!5m2!1sen!2sbd"
              // style="filter: grayscale(1) contrast(1.2) opacity(0.4);"
              style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
            ></iframe>

            <div className="relative flex flex-wrap rounded bg-white py-6 shadow-md">
              <div className="px-6 lg:w-1/2">
                <h2 className="title-font text-xs font-semibold tracking-widest text-gray-900">
                  ADDRESS
                </h2>
                <p className="mt-1">
                  Natore Station Bypass, Natore, Bangladesh
                </p>
              </div>
              <div className="mt-4 px-6 lg:mt-0 lg:w-1/2">
                <h2 className="title-font text-xs font-semibold tracking-widest text-gray-900">
                  EMAIL
                </h2>
                <a className="leading-relaxed text-indigo-500">
                  support@invoice.com
                </a>
                <h2 className="title-font mt-4 text-xs font-semibold tracking-widest text-gray-900">
                  PHONE
                </h2>
                <p className="leading-relaxed">123-456-7890</p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="mt-8 flex w-full flex-col rounded-md bg-white px-2 md:mt-0 md:ml-auto md:w-1/2 md:py-8 lg:w-1/3"
          >
            <h2 className="title-font mb-1 text-lg font-medium text-gray-900">
              Feedback
            </h2>
            <p className="mb-5 leading-relaxed text-gray-600">
              Let us know your feelings and any problem.
            </p>
            <div className="relative mb-4">
              <label htmlFor="name" className="text-sm leading-7 text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="aemail"
                className="text-sm leading-7 text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="aemail"
                name="email"
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="text-sm leading-7 text-gray-600"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="h-32 w-full resize-none rounded border border-gray-300 bg-white px-3 py-1 text-base leading-6 text-gray-700 transition-colors duration-200 ease-in-out outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800"
            >
              Send Message
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non rem
              porro tenetur!
            </p>
          </form>
        </div>
      </section>
      {/* <section className="h-screen w-full flex-center container mx-auto">
        <div
          key={2}
          id={item.invoiceId}
          className="w-full bg-sec-white p-2 md:p-3 rounded-lg flex flex-col gap-3 ring-2 ring-gray-800"
        >
          <div className="flex-between flex-wrap">
            <span className=" bg-purple-200 font-bold text-lg rounded-lg p-3 w-fit">
              Invoice #{(1).toString().padStart(4, "0")}
            </span>
            <span className="flex-center flex-wrap gap-3 text-3xl">
              <button className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100  active:bg-gray-400 transition-all">
                <FaDownload />
              </button>
              <button className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100  active:bg-gray-400 transition-all">
                <RiEdit2Line />
              </button>
              <button className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100  active:bg-gray-400 transition-all">
                <RiDeleteBin6Fill />
              </button>
            </span>
          </div>
          <div className="head w-full text-lg box-border font-semibold  flex-wrap flex-between bg-gray-200 p-1 rounded-lg gap-2 overflow-hidden overflow-ellipsis text-nowrap">
            <span>{item.full_name}</span>
            <span>{item.email}</span>
            <span>{item.phone}</span>
            <span>{item.address}</span>
          </div>
          <div className="w-full box-border bg-gray-200 rounded-lg p-2 flex items-center flex-wrap gap-2 overflow-hidden overflow-ellipsis text-nowrap">
            <span className="font-semibold">
              Product Item : {item.products.length}
            </span>
            {item.products &&
              item.products.map((e, i) => {
                return (
                  <span className="bg-gray-100 px-2 py-1 rounded-md" key={i}>
                    {e.product}(Q.{e.quantity})
                  </span>
                );
              })}
          </div>
          <div className="flex-between flex-wrap gap-3">
            <div className="flex-center flex-wrap gap-3">
              <span className="bg-gray-100 px-2 py-1 rounded-md font-bold">
                10% Off
              </span>
              {item.paid ? (
                <span className="bg-blue-300 px-2 py-1 rounded-md font-bold">
                  Paid
                </span>
              ) : (
                <span className="bg-red-500 px-2 py-1 rounded-md font-bold">
                  Due
                </span>
              )}
              <span className="flex-center flex-wrap gap-1">
                <span className="bg-purple-100 px-2 py-1 rounded-md font-bold text-[12px]">
                  Date : {item.date}
                </span>
                <span className="bg-purple-100 px-2 py-1 rounded-md font-bold text-[12px]">
                  Created At :{new Date(item.createdAt).toLocaleTimeString()}{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {item.updatedAt && (
                  <span className="bg-purple-100 px-2 py-1 rounded-md font-bold text-[12px]">
                    Last Updated :{" "}
                    {new Date(item.updatedAt).toLocaleTimeString()}{" "}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>

            <span className="font-semibold">
              <span>Total Price : </span>
              <span className="bg-gray-100 px-2 py-1 rounded-md ring-2 ring-gray-700">
                {item.products.length > 0 &&
                  (
                    item.products.reduce(
                      (sum, p) => sum + Number(p.quantity) * Number(p.amount),
                      0
                    ) *
                    (85 / 100)
                  ).toFixed(2)}
                /=
              </span>
            </span>
          </div>
        </div>
      </section> */}
      <div className="flex-center mx-auto w-fit flex-col rounded-2xl bg-gray-300 p-4">
        <input
          className="file:mr-5 file:rounded-full file:bg-gray-400 file:p-3"
          type="file"
          onChange={handleChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={!file}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Upload
        </button>

        {url && (
          <div className="mt-4">
            <p>Uploaded Image:</p>
            <Image height={200} src={url} alt="Uploaded" width={200} />
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
