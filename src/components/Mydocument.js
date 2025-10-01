import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// components/InvoiceDocument.js

// ✅ Invoice Document

const Mydocument = ({ item }) => {
  const totalAmount = item.products.reduce(
    (sum, p) => sum + Number(p.amount) * Number(p.quantity),
    0
  );

  // ✅ Styles
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 12,
      fontFamily: "Helvetica",
      color: "#333",
    },
    header: {
      marginBottom: 20,
      textAlign: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      color: "#666",
    },
    section: {
      marginBottom: 15,
    },
    label: {
      fontWeight: "bold",
      marginRight: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    tableHeader: {
      flexDirection: "row",
      borderBottom: "1 solid #000",
      paddingBottom: 4,
      marginBottom: 4,
    },
    th: {
      flex: 1,
      fontWeight: "bold",
    },
    td: {
      flex: 1,
    },
    total: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    totalText: {
      fontSize: 14,
      fontWeight: "bold",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      fontSize: 10,
      textAlign: "center",
      color: "#777",
    },
  });

  function inWord(n) {
    if (n < 0) return false;

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    let single_digit = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    let double_digit = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    let below_hundred = [
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (n === 0) return "Zero";

    // Recursive function to translate the number into words
    function translate(n) {
      let word = "";
      if (n < 10) {
        word = single_digit[n] + " ";
      } else if (n < 20) {
        word = double_digit[n - 10] + " ";
      } else if (n < 100) {
        let rem = translate(n % 10);
        word = below_hundred[(n - (n % 10)) / 10 - 2] + " " + rem;
      } else if (n < 1000) {
        word =
          single_digit[Math.trunc(n / 100)] + " Hundred " + translate(n % 100);
      } else if (n < 1000000) {
        word =
          translate(parseInt(n / 1000)).trim() +
          " Thousand " +
          translate(n % 1000);
      } else if (n < 1000000000) {
        word =
          translate(parseInt(n / 1000000)).trim() +
          " Million " +
          translate(n % 1000000);
      } else {
        word =
          translate(parseInt(n / 1000000000)).trim() +
          " Billion " +
          translate(n % 1000000000);
      }
      return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    return result.trim();
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subtitle}>
            Invoice ID: {item._id ? item._id : item.invoiceId}
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Customer Details</Text>
          <Text>{item.full_name}</Text>
          <Text>{item.email}</Text>
          <Text>{item.phone}</Text>
          <Text>{item.address}</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text>{item.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text>{item.paid ? "Paid" : "Unpaid"}</Text>
          </View>
          {item.isdiscount && (
            <View style={styles.row}>
              <Text style={styles.label}>Discount:</Text>
              <Text>
                {item.isdiscount ? `${item.discount}%` : "No Discount"}
              </Text>
            </View>
          )}
        </View>

        {/* Product Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Product</Text>
            <Text style={styles.th}>Quantity</Text>
            <Text style={styles.th}>Amount</Text>
            <Text style={styles.th}>Subtotal</Text>
          </View>

          {item.products.map((p, i) => {
            const subtotal = Number(p.quantity) * Number(p.amount);
            return (
              <View style={styles.row} key={i}>
                <Text style={styles.td}>{p.product}</Text>
                <Text style={styles.td}>{p.quantity}</Text>
                <Text style={styles.td}>{p.amount}</Text>
                <Text style={styles.td}>{subtotal}</Text>
              </View>
            );
          })}
        </View>

        {item.isdiscount && (
          <>
            {/* Total */}
            <View style={styles.total}>
              <Text style={styles.totalText}>Total: = {totalAmount}</Text>
            </View>
            {/* diccount */}
            <View style={styles.total}>
              <Text style={styles.totalText}>
                Discount: = ({(totalAmount * (item.discount / 100)).toFixed(2)})
              </Text>
            </View>
            {/* line */}
            <View style={styles.total}>
              <Text style={styles.totalText}>
                {"-----------------------------------------"}
              </Text>
            </View>
          </>
        )}
        <View style={styles.total}>
          <Text style={styles.totalText}>
            Total Payble: =
            {!item.isdiscount
              ? totalAmount
              : (totalAmount * ((100 - item.discount) / 100)).toFixed(2)}{" "}
            BDT
          </Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalText}>
            In Word :{" "}
            {!item.isdiscount
              ? inWord(parseInt(totalAmount))
              : inWord(
                  parseInt(
                    (totalAmount * ((100 - item.discount) / 100)).toFixed(2)
                  )
                )}{" "}
            BDT
          </Text>
        </View>
        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business! This is a system generated invoice.
        </Text>
      </Page>
    </Document>
  );
};

export default Mydocument;
