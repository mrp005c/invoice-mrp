import React from "react";
import { FaTruckLoading } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { RiDeleteBin6Fill, RiEdit2Line } from "react-icons/ri";

const page = () => {
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
  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
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

            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  ADDRESS
                </h2>
                <p className="mt-1">
                  Natore Station Bypass, Natore, Bangladesh
                </p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-indigo-500 leading-relaxed">
                  support@invoice.com
                </a>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                  PHONE
                </h2>
                <p className="leading-relaxed">123-456-7890</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full px-2 rounded-md md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
              Feedback
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600">
              Post-ironic portland shabby chic echo park, banjo fashion axe
            </p>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="aemail"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="aemail"
                name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-600"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Button
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Chicharrones blog helvetica normcore iceland tousled brook viral
              artisan.
            </p>
          </div>
        </div>
      </section>
      <section className="h-screen w-full flex-center container mx-auto">
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
              <button className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100 transition-all">
                <FaDownload />
              </button>
              <button className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100 transition-all">
                <RiEdit2Line />
              </button>
              <button className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100 transition-all">
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
      </section>
    </>
  );
};

export default page;
