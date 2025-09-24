"use client";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
// import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [invoices, setInvoices] = useState(null);
  const today = new Date().toISOString().split("T")[0];
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
    discount: 0,
  });

  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };
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

  const handleDownload = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      ...formInfo,
      products,
    });
    const id = formInfo.invoiceId;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const a = await fetch("/api/invoicepdf", requestOptions);
    const blob = await a.blob();
    if (blob) {
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
        discount: 0,
      });
    }
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${id}.pdf`;
    link.click();
  };
  return (
    <div className="flex-center flex-col min-h-screen bg-pri-gray w-full scroll-smooth">
      <section
        className="hero w-full h-screen relative"
        // style={backgroundImage:}
        // style={{backgroundImage: new URL('/herosectionbg.jpg')}}
        // style="background-image: url('/herosectionbg.jpg');"
      >
        <div className="img h-full w-full flex-center justify-end absolute bg-cover bg-center blur-md min-[3000px]:blur-2xl rounded-br-[25%] box-border pr-24 z-10 bg-[url('/herosectionbg.jpg')]  "></div>
        <div className="relative z-30 h-full pt-16 w-full flex-center bg-[#00000039] text-sec-white">
          {/* <Image
            width={800}
            height={500}
            src="/header_Invoices2.avif"
            alt="none"
          /> */}
          <div className="text-box p-1 sm:p-2 md:p-3 flex-center flex-col gap-4 max-w-[900px] ">
            <h2 className="text-6xl md:text-8xl font-bold text-center text-shadow-lg text-shadow-blue-700 max-[320px]:text-5xl">
              Welcome to Our Invoice Web
            </h2>
            <div className="links text-base md:text-lg text-sec-white flex-center gap-3 text-center flex-wrap">
              <span>#1 Performance Benchmark</span>
              <span>#1 Compititive Bake-Off</span>
              <span>#1 Ranking One Go2</span>
            </div>
            <div className="buttons text-lg md:text-xl flex-center gap-3 flex-wrap">
              <Link
                className="prim-btn w-fit bg-blue-600  hover:bg-violet-400 active:bg-violet-900 transition-all"
                href="/#invoices"
              >
                Get Started
              </Link>
              <Link
                className="prim-btn w-fit bg-blue-600 hover:bg-violet-400 active:bg-violet-900 transition-all"
                href="/about"
              >
                Know More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="invoices"
        className="h-fit w-full bg-[#1858b8] flex-center items-end "
      >
        <div className="flex flex-col container py-8  mx-auto gap-4 p-3 bg-gray-200 rounded-2xl overflow-auto">
          <h2 className="text-2xl flex-center font-bold ">
            Create Your Invoice
          </h2>
          <form
            className="flex flex-col min-w-[400px] w-full max-w-[900px] text-sm mx-auto gap-4 p-3 bg-gray-300 rounded-2xl overflow-auto"
            onSubmit={handleDownload}
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
                                (products[index].amount || 0).toFixed(2)}
                            </p>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`w-full opacity-20 hover:opacity-100 active:opacity-100 p-3 h-full ${
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
                        <p className="w-full pl-2 h-12 flex-center items-end flex-col">
                          <span>
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
                          </span>
                          <span className="text-[10px] font-light">
                            (Main Price + 15% Tax)
                          </span>
                        </p>
                        {formInfo.isdiscount && (
                          <p className="w-full pl-2 h-12 flex-center justify-end ">
                            Discount {formInfo.discount}%
                          </p>
                        )}
                      </td>
                      <td className="bg-amber-50">
                        <p className="w-full flex-center pl-2 bg-amber-50 h-12 outline-none  box-border focus:border-gray-400 focus:ring-1 ring-gray-400">
                          {products
                            .reduce(
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0
                            )
                            .toFixed(2)}
                        </p>
                        {formInfo.isdiscount && (
                          <p className="w-full flex-center pl-2 bg-amber-50 h-12 outline-none box-border focus:border-gray-400 focus:ring-1 ring-gray-400">
                            (
                            {(
                              products.reduce(
                                (sum, p) =>
                                  sum + Number(p.quantity) * Number(p.amount),
                                0
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
                            className="accent-orange-400 cursor-pointer"
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
                              value={formInfo.discount || 0}
                            />
                          </span>
                        )}

                        <span className="ml-auto font-bold px-2">Payble</span>
                      </div>
                    </td>
                    <td>
                      <p className="w-full flex-center pl-2 bg-amber-50 h-12 outline-none border-2 box-border focus:border-gray-400 focus:ring-1 ring-gray-400">
                        ৳
                        {!formInfo.isdiscount &&
                          products
                            .reduce(
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0
                            )
                            .toFixed(2)}
                        {formInfo.isdiscount &&
                          (
                            products.reduce(
                              (sum, p) =>
                                sum + Number(p.quantity) * Number(p.amount),
                              0
                            ) *
                            ((100 - formInfo.discount) / 100)
                          ).toFixed(2)}
                      </p>
                    </td>
                    <td className="font-bold text-blue-700">
                      <input
                        className="accent-orange-400 cursor-pointer"
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
            <button className="sec-btn w-fit px-10 m-auto" type="submit">
              Download PDF
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

{
  /* <FontAwesomeIcon icon={faCoffee} />
      <FontAwesomeIcon icon={faHeart} className="text-red-500" />
      <FontAwesomeIcon icon={faGithub} className="text-gray-800" />
      <FontAwesomeIcon icon={faFileInvoice} className="text-gray-800" />
      <FontAwesomeIcon icon={faGoogle} className="" />
       <FcGoogle size={24} />
       <FaFacebook size={24} />
       <FaInstagram size={24} /> */
}
