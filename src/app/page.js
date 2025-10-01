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
    discount: "",
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
        discount: "",
      });
    }
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${id}.pdf`;
    link.click();
  };
  return (
    <div className="flex-center bg-pri-gray min-h-screen w-full flex-col scroll-smooth">
      <section
        className="hero relative h-screen w-full"
        // style={backgroundImage:}
        // style={{backgroundImage: new URL('/herosectionbg.jpg')}}
        // style="background-image: url('/herosectionbg.jpg');"
      >
        <div className="img flex-center absolute z-10 box-border h-full w-full justify-end rounded-br-[25%] bg-cover bg-center pr-24 blur-sm min-[3000px]:blur-md">
          {" "}
          <Image
            className="h-full w-full object-cover object-center"
            fill={true}
            priority={true}
            alt="herosection image"
            src="/herosectionbg.jpg"
          ></Image>
        </div>
        <div className="flex-center text-sec-white relative z-30 h-full w-full bg-[#00000039] pt-16">
          {/* <Image
            width={800}
            height={500}
            src="/header_Invoices2.avif"
            alt="none"
          /> */}
          <div className="text-box flex-center max-w-[900px] flex-col gap-4 p-1 sm:p-2 md:p-3">
            <h2 className="text-center text-6xl font-bold text-shadow-blue-700 text-shadow-lg max-[320px]:text-5xl md:text-8xl">
              Welcome to Our Invoice Web
            </h2>
            <div className="links text-sec-white flex-center flex-wrap gap-3 text-center text-base md:text-lg">
              <span>#1 Performance Benchmark</span>
              <span>#1 Compititive Bake-Off</span>
              <span>#1 Ranking One Go2</span>
            </div>
            <div className="buttons flex-center flex-wrap gap-3 text-lg md:text-xl">
              <Link
                className="prim-btn w-fit bg-blue-600 transition-all hover:bg-violet-400 active:bg-violet-900"
                href="/#invoices"
              >
                Get Started
              </Link>
              <Link
                className="prim-btn w-fit bg-blue-600 transition-all hover:bg-violet-400 active:bg-violet-900"
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
        className="flex-center h-fit w-full items-end bg-[#1858b8]"
      >
        <div className="container mx-auto flex flex-col gap-4 overflow-auto rounded-2xl bg-gray-200 p-3 py-8">
          <h2 className="flex-center text-2xl font-bold">
            Create Your Invoice
          </h2>
          <form
            className="mx-auto flex w-full max-w-[900px] min-w-[550px] flex-col gap-4 overflow-auto rounded-2xl bg-gray-300 p-3 text-sm"
            onSubmit={handleDownload}
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
                              value={formInfo.discount || ""}
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
