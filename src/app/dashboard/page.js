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
    });

    setProducts(item.products);

    router.push("/dashboard#add_invoices");
  };

  if (session) {
    return (
      <>
        <ToastContainer />
        <div className="text-lg flex flex-col sm:flex-row  container mx-auto gap-4 bg-gray-200 my-4 p-1 md:p-3 rounded-2xl">
          <div className="left-side w-full sm:max-w-[200px] p-3 bg-gray-300 flex-center justify-start flex-col gap-3 rounded-2xl">
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
            <div className="right-side  p-3 bg-gray-300 flex flex-col flex-1 gap-3 rounded-2xl">
              <h3 className="text-2xl font-bold">
                Profile
                {/* {(tab === "profile" || tab === null) && "Profile"} */}
                {/* {tab == "edit_profile" && "Edit Profile"}
                {tab == "subscription" && "Subscription"}
                {tab == "promo_code" && "Promo Code"}
                {tab == "gifts" && "Gifts"} */}
              </h3>
              <div className="flex">
                <span className="font-bold userinfo-key">Name: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.name}</span>
              </div>
              <div className="flex">
                <span className="font-bold userinfo-key">Email: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.email}</span>
              </div>
              <div className="flex">
                <span className="font-bold userinfo-key">Phone: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.phone}</span>
              </div>
              <div className="flex">
                <span className="font-bold userinfo-key">
                  Birth Date: &nbsp;
                </span>
                <span className="userinfo-item"> {userinfo.birth_date}</span>
              </div>
              <div className="flex">
                <span className="font-bold userinfo-key">Address: &nbsp;</span>
                <span className="userinfo-item"> {userinfo.address}</span>
              </div>
            </div>
          )}
        </div>
        {/* This is Your ADD Invoices Line */}
        <div
          id="add_invoices"
          className="flex flex-col container py-8  mx-auto gap-4 p-3 bg-gray-200 rounded-2xl overflow-auto"
        >
          <h2 className="text-2xl flex-center font-bold ">Add Your Invoice</h2>
          <form
            className="flex flex-col min-w-[400px] w-full max-w-[900px] text-sm mx-auto gap-4 p-3 bg-gray-300 rounded-2xl overflow-auto"
            onSubmit={handleSubmit}
          >
            <h1 className="flex-center text-3xl font-bold m-3 text-pri-blue w-fit px-4 py-3 bg-gray-100 rounded-3xl mx-auto">
              Invoice
            </h1>
            <div className="companyinfo flex-center flex-col bg-gray-200  p-3 rounded-2xl">
              <h3 className="text-2xl font-semibold text-sec-blue">
                Invoice Maker Co. LTD
              </h3>
              <div className="cem-ph flex-between gap-2 text-xs">
                <span>Email : support@invoice.com</span>
                <span>Phone : +9177882233</span>
              </div>
            </div>
            <div className="w-full flex-between items-start bg-gray-200 p-2 rounded-xl">
              <div className="name-email-address w-1/3 flex gap-2 flex-col">
                <div className="flex items-center flex-1">
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
                <div className="flex items-center flex-1">
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
                <div className="flex items-center flex-1">
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
              <div className="name-email-address w-1/3 flex gap-2 flex-col">
                <div className="flex items-center flex-1 flex-wrap">
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
                <div className="flex items-center flex-1">
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
            <div className="products bg-gray-200 p-3 box-border rounded-2xl">
              {/* <h4 className="text-lg font-bold">Items</h4> */}
              <table className="w-full  border-collapse box-border">
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
                              className="w-full pl-2  bg-amber-50 h-12 outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400"
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
                              className="w-full pl-2 bg-amber-50 h-12  outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400"
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
                              className="w-full pl-2 bg-amber-50 h-12 outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400"
                              type="number"
                              min={1}
                              step={1}
                              name="amount"
                              id="amount"
                              placeholder="Enter Amount"
                              onChange={(e) =>
                                handlePchange(
                                  index,
                                  "amount",
                                  Number(e.target.value)
                                )
                              }
                              value={products[index].amount}
                              required
                            />
                          </td>
                          <td>
                            <p className="w-full pl-2 flex-center bg-amber-50 h-12 outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400">
                              {(products[index].quantity || 0) *
                                (products[index].amount || 0)}
                            </p>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`w-full  opacity-0 hover:opacity-100 p-3 hover:visible h-full ${
                                products.length <= 1 ? "hidden" : ""
                              }`}
                              onClick={() =>
                                setProducts((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                            >
                              <p className="flex-center  text-2xl w-full h-full">
                                <MdDelete className="flex-center " />
                              </p>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>

                <tfoot>
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
                  <tr>
                    <td colSpan={3}>
                      <p className="w-full pl-2 h-12 flex-center justify-end  font-bold">
                        Total Amount(
                        {(
                          products.reduce(
                            (sum, p) =>
                              sum + Number(p.quantity) * Number(p.amount),
                            0
                          ) *
                          (85 / 100)
                        ).toFixed(2)}
                        +
                        {(
                          products.reduce(
                            (sum, p) =>
                              sum + Number(p.quantity) * Number(p.amount),
                            0
                          ) *
                          (15 / 100)
                        ).toFixed(2)}
                        )
                        <span className="text-[10px] font-light">
                          (Main Price + 15% Tax)
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="w-full flex-center pl-2 bg-amber-50 h-12 outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400">
                        ৳
                        {products
                          .reduce(
                            (sum, p) =>
                              sum + Number(p.quantity) * Number(p.amount),
                            0
                          )
                          .toFixed(2)}
                      </p>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <p className="w-full pl-2 h-12 flex-center justify-end font-bold">
                        Discount 10% (
                        {products
                          .reduce(
                            (sum, p) =>
                              sum + Number(p.quantity) * Number(p.amount),
                            0
                          )
                          .toFixed(2)}
                        -
                        {(
                          products.reduce(
                            (sum, p) =>
                              sum + Number(p.quantity) * Number(p.amount),
                            0
                          ) *
                          (10 / 100)
                        ).toFixed(2)}
                        )
                      </p>
                    </td>
                    <td>
                      <p className="w-full flex-center pl-2 bg-amber-50 h-12 outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400">
                        ৳
                        {(
                          products.reduce(
                            (sum, p) =>
                              sum + Number(p.quantity) * Number(p.amount),
                            0
                          ) *
                          (90 / 100)
                        ).toFixed(2)}
                      </p>
                    </td>
                    <td className="font-bold text-blue-700">
                      <input
                        className="accent-orange-400"
                        checked={formInfo.paid || false}
                        onChange={(e) =>
                          setFormInfo({ ...formInfo, paid: e.target.checked })
                        }
                        type="checkbox"
                        name="check"
                        id="check"
                      />
                      Paid
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button className="sec-btn w-fit px-10 m-auto" type="submit">
              Save
            </button>
          </form>
        </div>
        <div
          id="invoices"
          className="flex flex-col container py-8  mx-auto gap-4 p-3 bg-gray-200 rounded-2xl"
        >
          {/* This is Your Invoices Line */}
          <h2 className="text-3xl font-bold flex-center">Your Invoices</h2>
          {invoices ? (
            invoices.map((item, index) => {
              return (
                <div
                  key={index}
                  id={item.invoiceId}
                  className="w-full bg-sec-white p-2 md:p-3 rounded-lg flex flex-col gap-3 ring-2 ring-gray-800"
                >
                  <div className="flex-between flex-wrap">
                    <span className=" bg-purple-200 font-bold text-lg rounded-lg p-3 w-fit">
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
                        className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100  active:bg-gray-400 transition-all"
                      >
                        <GrDocumentDownload />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditInvoice(item._id, item)}
                        className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100  active:bg-gray-400 transition-all"
                      >
                        <RiEdit2Line />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInvoice(item.invoiceId)}
                        className="flex-center p-3 box-border rounded-full bg-gray-300 hover:bg-gray-100  active:bg-gray-400 transition-all"
                      >
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
                          <span
                            className="bg-gray-100 px-2 py-1 rounded-md"
                            key={i}
                          >
                            {e.product}(Q.{e.quantity} ৳.{e.amount})
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
                          Created At :
                          {new Date(item.createdAt).toLocaleTimeString()}{" "}
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
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0
                            ) *
                            (85 / 100)
                          ).toFixed(2)}
                        /=
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-2xl flex-center font-bold text-red-400 px-2 py-16 bg-gray-300 rounded-lg">
              No Items Found
            </div>
          )}
        </div>
      </>
    );
  }
};

export default MPage;
