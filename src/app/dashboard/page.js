"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { RiDeleteBin6Fill, RiEdit2Line } from "react-icons/ri";
import { GrDocumentDownload } from "react-icons/gr";

const MPage = () => {
  const searchParams = useSearchParams();

  const queryTab = searchParams.get("tab");
  const { data: session, status } = useSession();
  const [userinfo, setUserinfo] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [tab, setTab] = useState("");
  const [fetchUserTrue, setFetchUserTrue] = useState(false);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd format
  const [products, setProducts] = useState([
    { product: "", quantity: "", amount: "" },
  ]);

  const [formInfo, setFormInfo] = useState({
    invoiceId: uuidv4(),
    full_name: "",
    email: "",
    phone: "",
    date: today,
    address: "",
    paid: false,
    isdiscount: false,
    discount: "",
  });

  const handleDownload = async (id, item) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(item);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const a = await fetch("/api/invoicepdf", requestOptions);
    const blob = await a.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${id}.pdf`;
    link.click();
    // ReactPDF.renderToStream(<MyDocument />);
  };

  // user effect

  useEffect(() => {
    setTab(() => queryTab);
    if (queryTab === "edited") {
      setFetchUserTrue((e) => !e);
    }
  }, [queryTab]);

  // user details
  let fetchUser = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    try {
      if (session) {
        const fetchUrl = `/api/user?email=${session.user.email}`;
        const a = await fetch(fetchUrl, requestOptions);
        const res = await a.json();
        if (res.success) {
          setUserinfo(res.data);
        }
      }
    } catch (error) {
      console.log("Error Happend", error);
    }
  }, [session]);

  useEffect(() => {
    fetchUser();
  }, [session, fetchUserTrue, fetchUser]);

  // get Invoices
  const handleGet = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    try {
      if (session) {
        const url = `/api/invoices?email=${session.user.email}`;
        const a = await fetch(url, requestOptions);
        const res = await a.json();

        setInvoices(res.result);
      }
    } catch (error) {
      console.log("Error Happend on dashboard/invoices", error);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      handleGet();
    }
  }, [handleGet, session, formInfo.invoiceId]);

  // form change handle
  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };

  // products changed handler
  const handlePchange = (index, key, value) => {
    setProducts((iniItems) => {
      return iniItems.map((item, i) => {
        if (i == index) {
          return { ...item, [key]: value };
        } else {
          return item;
        }
      });
    });
  };

  // Submit Invoice and Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // e.target.reset()
    const id = formInfo.id;
    const invId = formInfo.invoiceId;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      ...formInfo,
      products,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      if (session) {
        const url = formInfo.id
          ? `/api/invoices/update?email=${session.user.email}`
          : `/api/invoices?email=${session.user.email}`;
        const a = await fetch(url, requestOptions);
        const res = await a.json();

        if (res.success) {
          toast.success(res.message);
          setProducts([{ product: "", quantity: "", amount: "" }]);
          setFormInfo({
            invoiceId: uuidv4(),
            full_name: "",
            email: "",
            phone: "",
            date: today,
            address: "",
            paid: false,
            isdiscount: false,
            discount: "",
          });
          if (id && id.length > 0) {
            router.push(`/dashboard#${invId}`);
          } else {
            router.push(`/dashboard#invoices`);
          }
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Fetch Failed !");
      }
    } catch (error) {
      toast.error(error.message);
      console.log({ "Error Occured": error });
    }
  };

  // Delete Invlice
  const handleDeleteInvoice = async (id) => {
    let a = confirm(`Delete The Item ? invoiceID : ${id} `);
    if (!a) {
      return;
    }
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    try {
      if (session) {
        const url = `/api/invoices?email=${session.user.email}&invoiceId=${id}`;
        const a = await fetch(url, requestOptions);
        const res = await a.json();

        if (res.success) {
          toast.success(res.message);
          handleGet();
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Fetch Failed !");
      }
    } catch (error) {
      toast.error(error.message);
      console.log({ "Error Occured": error });
    }
  };

  // handle Edit Invlice
  const handleEditInvoice = async (id, item) => {
    setFormInfo({
      id: item._id || "",
      invoiceId: item.invoiceId || uuidv4(),
      full_name: item.full_name || "",
      email: item.email || "",
      phone: item.phone || "",
      date: item.date || today,
      address: item.address || "",
      paid: item.paid || false,
      isdiscount: item.isdiscount || false,
      discount: item.discount,
    });

    setProducts(item.products);

    router.push("/dashboard#add_invoices");
  };

  if (session) {
    return (
      <>
        <ToastContainer className="fixed z-50" />
        <div className="container mx-auto my-4 flex flex-col gap-4 scroll-smooth rounded-2xl bg-gray-200 p-1 text-lg sm:flex-row md:p-3">
          <div className="left-side flex-center w-full flex-col justify-start gap-3 rounded-2xl bg-gray-300 p-3 sm:max-w-[200px]">
            <button
              type="button"
              onClick={() => router.push("/dashboard?tab=profile")}
              className={`${
                tab === "profile" || tab === null ? "bg-black" : ""
              } prim-btn w-full`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard?tab=add_invoices#add_invoices")
              }
              className={`${
                tab === "add_invoices" ? "bg-black" : ""
              } prim-btn w-full`}
            >
              Add Invoices
            </button>
            <button
              onClick={() => router.push("/dashboard?tab=invoices#invoices")}
              className={`${
                tab === "invoices" ? "bg-black" : ""
              } prim-btn w-full`}
            >
              Your Invoices
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard?tab=subscription")}
              className={`${
                tab === "subscription" ? "bg-black" : ""
              } prim-btn w-full`}
            >
              Subscription
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard?tab=promo_code")}
              className={`${
                tab === "promo_code" ? "bg-black" : ""
              } prim-btn w-full`}
            >
              Promo Code
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard?tab=gifts")}
              className={`${tab === "gifts" ? "bg-black" : ""} prim-btn w-full`}
            >
              Gifts
            </button>
          </div>

          {userinfo && (
            <div className="right-side flex flex-1 flex-col gap-3 rounded-2xl bg-gray-300 p-3">
              <h3 className="text-2xl font-bold">
                Profile
                {/* {(tab === "profile" || tab === null) && "Profile"} */}
                {/* {tab == "edit_profile" && "Edit Profile"}
                {tab == "subscription" && "Subscription"}
                {tab == "promo_code" && "Promo Code"}
                {tab == "gifts" && "Gifts"} */}
              </h3>
              <div className="flex">
                <span className="userinfo-key font-bold">Name: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.name}</span>
              </div>
              <div className="flex">
                <span className="userinfo-key font-bold">Email: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.email}</span>
              </div>
              <div className="flex">
                <span className="userinfo-key font-bold">Phone: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.phone}</span>
              </div>
              <div className="flex">
                <span className="userinfo-key font-bold">
                  Birth Date: &nbsp;
                </span>
                <span className="userinfo-item"> {userinfo.birth_date}</span>
              </div>
              <div className="flex">
                <span className="userinfo-key font-bold">Address: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.address}</span>
              </div>
            </div>
          )}
        </div>
        {/* This is Your ADD Invoices Line */}
        <div
          id="add_invoices"
          className="container mx-auto flex flex-col gap-4 overflow-auto rounded-2xl bg-gray-200 p-3 py-8"
        >
          <h2 className="flex-center text-2xl font-bold">Add Your Invoice</h2>
          <form
            className="mx-auto flex w-full max-w-[900px] min-w-[400px] flex-col gap-4 overflow-auto rounded-2xl bg-gray-300 p-3 text-sm"
            onSubmit={handleSubmit}
          >
            <h1 className="flex-center text-pri-blue m-3 mx-auto w-fit rounded-3xl bg-gray-100 px-4 py-3 text-3xl font-bold">
              Invoice
            </h1>
            <div className="companyinfo flex-center flex-col rounded-2xl bg-gray-200 p-3">
              <h3 className="text-sec-blue text-2xl font-semibold">
                Invoice Maker Co. LTD
              </h3>
              <div className="cem-ph flex-between gap-2 text-xs">
                <span>Email : support@invoice.com</span>
                <span>Phone : +9177882233</span>
              </div>
            </div>
            <div className="flex-between w-full items-start rounded-xl bg-gray-200 p-2">
              <div className="name-email-address flex w-1/3 flex-col gap-2">
                <div className="flex flex-1 items-center">
                  <label className="font-semibold" htmlFor="full_name">
                    Name :
                  </label>
                  <input
                    className="input-style flex-1"
                    type="text"
                    name="full_name"
                    id="full_name"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    value={formInfo.full_name || ""}
                    required
                  />
                </div>
                <div className="flex flex-1 items-center">
                  <label className="font-semibold" htmlFor="formemail">
                    Email :
                  </label>
                  <input
                    className="input-style flex-1"
                    type="email"
                    name="email"
                    id="formemail"
                    placeholder="Enter Email"
                    onChange={handleChange}
                    value={formInfo.email || ""}
                    required
                  />
                </div>
                <div className="flex flex-1 items-center">
                  <label className="font-semibold" htmlFor="formphone">
                    Phone :
                  </label>
                  <input
                    className="input-style flex-1"
                    type="text"
                    name="phone"
                    id="formphone"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    value={formInfo.phone || ""}
                    required
                  />
                </div>
              </div>
              <div className="name-email-address flex w-1/3 flex-col gap-2">
                <div className="flex flex-1 flex-wrap items-center">
                  <label className="font-semibold" htmlFor="date">
                    Date :
                  </label>
                  <input
                    className="input-style flex-1"
                    type="date"
                    name="date"
                    id="date"
                    onChange={handleChange}
                    value={formInfo.date || today}
                    placeholder="Enter Date"
                  />
                </div>
                <div className="flex flex-1 items-center">
                  <label className="font-semibold" htmlFor="formaddress">
                    Address :
                  </label>
                  <input
                    className="input-style flex-1"
                    type="text"
                    name="address"
                    id="formaddress"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    value={formInfo.address || ""}
                  />
                </div>
              </div>
            </div>

            {/* products line */}
            <div className="products box-border rounded-2xl bg-gray-200 p-3">
              {/* <h4 className="text-lg font-bold">Items</h4> */}
              <table className="box-border w-full border-collapse">
                <thead className="w-full">
                  <tr className="w-full">
                    <th className="w-1/2">Products</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Buttons</th>
                  </tr>
                </thead>

                <tbody>
                  {products &&
                    products.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              className="box-border h-12 w-full border-2 bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1"
                              type="text"
                              name="product"
                              id="product"
                              placeholder="Enter Product Name"
                              onChange={(e) =>
                                handlePchange(index, "product", e.target.value)
                              }
                              value={products[index].product}
                              required
                            />
                          </td>
                          <td>
                            <input
                              className="box-border h-12 w-full border-2 bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1"
                              type="number"
                              name="quantity"
                              id="quantity"
                              min={1}
                              step={1}
                              placeholder="Enter Quantity"
                              onChange={(e) =>
                                handlePchange(index, "quantity", e.target.value)
                              }
                              value={products[index].quantity}
                              required
                            />
                          </td>
                          <td>
                            <input
                              className="box-border h-12 w-full border-2 bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1"
                              type="number"
                              min={1}
                              step={1}
                              name="amount"
                              id="amount"
                              placeholder="Enter Amount"
                              onChange={(e) =>
                                handlePchange(index, "amount", e.target.value)
                              }
                              value={products[index].amount}
                              required
                            />
                          </td>
                          <td>
                            <p className="flex-center box-border h-12 w-full border-2 bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1">
                              {(
                                (products[index].quantity || 0) *
                                (products[index].amount || 0)
                              ).toFixed(2)}
                            </p>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`h-full w-full p-3 opacity-20 hover:opacity-100 active:opacity-100 ${
                                products.length <= 1 ? "hidden" : ""
                              }`}
                              onClick={() =>
                                setProducts((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                            >
                              <p className="flex-center h-full w-full text-2xl">
                                <MdDelete className="flex-center" />
                              </p>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>

                <tfoot>
                  {/* buttons */}
                  <tr>
                    <td colSpan={5}>
                      <button
                        type="button"
                        className="prim-btn my-2"
                        onClick={() =>
                          setProducts([
                            ...products,
                            { product: "", quantity: "", amount: "" },
                          ])
                        }
                      >
                        Add More
                      </button>
                    </td>
                  </tr>
                  {/* discount panel */}
                  {formInfo.isdiscount && (
                    <tr>
                      <td colSpan={3}>
                        <p className="flex-center h-12 w-full flex-col items-end pl-2">
                          <span>
                            Total Amount(
                            {(
                              products.reduce(
                                (sum, p) =>
                                  sum + Number(p.quantity) * Number(p.amount),
                                0,
                              ) *
                              (85 / 100)
                            ).toFixed(2)}
                            +
                            {(
                              products.reduce(
                                (sum, p) =>
                                  sum + Number(p.quantity) * Number(p.amount),
                                0,
                              ) *
                              (15 / 100)
                            ).toFixed(2)}
                            )
                          </span>
                          <span className="text-[10px] font-light">
                            (Main Price + 15% Tax)
                          </span>
                        </p>
                        {formInfo.isdiscount && (
                          <p className="flex-center h-12 w-full justify-end pl-2">
                            Discount {formInfo.discount}%
                          </p>
                        )}
                      </td>
                      <td className="bg-amber-50">
                        <p className="flex-center box-border h-12 w-full bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1">
                          {products
                            .reduce(
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0,
                            )
                            .toFixed(2)}
                        </p>
                        {formInfo.isdiscount && (
                          <p className="flex-center box-border h-12 w-full bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1">
                            (
                            {(
                              products.reduce(
                                (sum, p) =>
                                  sum + Number(p.quantity) * Number(p.amount),
                                0,
                              ) *
                              (formInfo.discount / 100)
                            ).toFixed(2)}
                            )
                          </p>
                        )}
                      </td>
                      <td></td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3}>
                      <div className="flex items-center">
                        <span>
                          <input
                            className="cursor-pointer accent-orange-400"
                            checked={formInfo.isdiscount || false}
                            onChange={(e) =>
                              setFormInfo({
                                ...formInfo,
                                isdiscount: e.target.checked,
                              })
                            }
                            type="checkbox"
                            name="check"
                            id="isdiscount"
                          />
                          <label
                            className="cursor-pointer px-2"
                            htmlFor="isdiscount"
                          >
                            Discount
                          </label>
                        </span>
                        {formInfo.isdiscount && (
                          <span>
                            <input
                              className="input-style flex-1"
                              type="number"
                              min={1}
                              step={1}
                              name="discount"
                              id="discount"
                              placeholder="Discount"
                              onChange={handleChange}
                              value={formInfo.discount}
                            />
                          </span>
                        )}

                        <span className="ml-auto px-2 font-bold">Payble</span>
                      </div>
                    </td>
                    <td>
                      <p className="flex-center box-border h-12 w-full border-2 bg-amber-50 pl-2 ring-gray-400 outline-none focus:border-gray-400 focus:ring-1">
                        ৳
                        {!formInfo.isdiscount &&
                          products
                            .reduce(
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0,
                            )
                            .toFixed(2)}
                        {formInfo.isdiscount &&
                          (
                            products.reduce(
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0,
                            ) *
                            ((100 - formInfo.discount) / 100)
                          ).toFixed(2)}
                      </p>
                    </td>
                    <td className="font-bold text-blue-700">
                      <input
                        className="cursor-pointer accent-orange-400"
                        checked={formInfo.paid || false}
                        onChange={(e) =>
                          setFormInfo({ ...formInfo, paid: e.target.checked })
                        }
                        type="checkbox"
                        name="check"
                        id="check"
                      />
                      <label htmlFor="check" className="cursor-pointer">
                        Paid
                      </label>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button className="sec-btn m-auto w-fit px-10" type="submit">
              Save
            </button>
          </form>
        </div>
        <div
          id="invoices"
          className="container mx-auto flex flex-col gap-4 rounded-2xl bg-gray-200 p-3 py-8"
        >
          {/* This is Your Invoices Line */}
          <h2 className="flex-center text-3xl font-bold">Your Invoices</h2>
          {invoices ? (
            invoices.map((item, index) => {
              return (
                <div
                  key={index}
                  id={item.invoiceId}
                  className="bg-sec-white flex w-full flex-col gap-3 rounded-lg p-2 ring-2 ring-gray-800 md:p-3"
                >
                  <div className="flex-between flex-wrap">
                    <span className="w-fit rounded-lg bg-purple-200 p-3 text-lg font-bold">
                      Invoice #{(index + 1).toString().padStart(4, "0")}
                    </span>
                    <span className="flex-center flex-wrap gap-3 text-3xl">
                      {/* <PDFDownloadLink
                        document={<InvoicePDF invoice={item} />}
                        fileName={`invoice-${item.invoiceId}.pdf`}
                      >
                        {({ loading }) =>
                          loading ? <FaTruckLoading /> : <FaDownload />
                        }
                      </PDFDownloadLink> */}
                      <button
                        type="button"
                        onClick={() => handleDownload(item._id, item)}
                        className="flex-center box-border rounded-full bg-gray-300 p-3 transition-all hover:bg-gray-100 active:bg-gray-400"
                      >
                        <GrDocumentDownload />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditInvoice(item._id, item)}
                        className="flex-center box-border rounded-full bg-gray-300 p-3 transition-all hover:bg-gray-100 active:bg-gray-400"
                      >
                        <RiEdit2Line />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInvoice(item.invoiceId)}
                        className="flex-center box-border rounded-full bg-gray-300 p-3 transition-all hover:bg-gray-100 active:bg-gray-400"
                      >
                        <RiDeleteBin6Fill />
                      </button>
                    </span>
                  </div>
                  <div className="head flex-between box-border w-full flex-wrap gap-2 overflow-hidden rounded-lg bg-gray-200 p-1 text-lg font-semibold text-nowrap overflow-ellipsis">
                    <span>{item.full_name}</span>
                    <span>{item.email}</span>
                    <span>{item.phone}</span>
                    <span>{item.address}</span>
                  </div>
                  <div className="box-border flex w-full flex-wrap items-center gap-2 overflow-hidden rounded-lg bg-gray-200 p-2 text-nowrap overflow-ellipsis">
                    <span className="font-semibold">
                      Product Item : {item.products.length}
                    </span>
                    {item.products &&
                      item.products.map((e, i) => {
                        return (
                          <span
                            className="rounded-md bg-gray-100 px-2 py-1"
                            key={i}
                          >
                            {e.product}(Q.{e.quantity} ৳.{e.amount})
                          </span>
                        );
                      })}
                  </div>
                  <div className="flex-between flex-wrap gap-3">
                    <div className="flex-center flex-wrap gap-3">
                      {item.isdiscount && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 font-bold">
                          {item.discount}% Off
                        </span>
                      )}
                      {item.paid ? (
                        <span className="rounded-md bg-blue-300 px-2 py-1 font-bold">
                          Paid
                        </span>
                      ) : (
                        <span className="rounded-md bg-red-500 px-2 py-1 font-bold">
                          Due
                        </span>
                      )}
                      <span className="flex-center flex-wrap gap-1">
                        <span className="rounded-md bg-purple-100 px-2 py-1 text-[12px] font-bold">
                          Date : {item.date}
                        </span>
                        <span className="rounded-md bg-purple-100 px-2 py-1 text-[12px] font-bold">
                          Created At :
                          {new Date(item.createdAt).toLocaleTimeString()}{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.updatedAt && (
                          <span className="rounded-md bg-purple-100 px-2 py-1 text-[12px] font-bold">
                            Last Updated :{" "}
                            {new Date(item.updatedAt).toLocaleTimeString()}{" "}
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    </div>

                    <span className="font-semibold">
                      <span>Total Price : </span>
                      <span
                        className={`${
                          item.paid ? "bg-gray-100" : "bg-red-500 text-white"
                        } rounded-md px-2 py-1 ring-2 ring-gray-700`}
                      >
                        {item.isdiscount
                          ? (
                              item.products.reduce(
                                (sum, p) =>
                                  sum + Number(p.quantity) * Number(p.amount),
                                0,
                              ) *
                              ((100 - item.discount) / 100)
                            ).toFixed(2)
                          : item.products
                              .reduce(
                                (sum, p) =>
                                  sum + Number(p.quantity) * Number(p.amount),
                                0,
                              )
                              .toFixed(2)}
                        /=
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-center rounded-lg bg-gray-300 px-2 py-16 text-2xl font-bold text-red-400">
              No Items Found
            </div>
          )}
        </div>
      </>
    );
  }
};

export default MPage;
