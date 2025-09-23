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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subtitle}>Invoice ID: {item._id? item._id : item.invoiceId}</Text>
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

        {/* Total */}
        <View style={styles.total}>
          <Text style={styles.totalText}>
            Total: = {totalAmount}
          </Text>
        </View>
        {/* diccount */}
        <View style={styles.total}>
          <Text style={styles.totalText}>
           Discount: =  ({(totalAmount * 10) / 100})
          </Text>
        </View>
        {/* line */}
        <View style={styles.total}>
          <Text style={styles.totalText}>
           {"-----------------------------------------"}
          </Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalText}>
            Total Payble: = {(totalAmount * 90) / 100} BDT
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
