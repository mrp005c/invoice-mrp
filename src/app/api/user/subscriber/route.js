import { NextResponse } from "next/server";
import clientPromise from "@/lib/moingoDb";

//Post Your Data
export async function POST(request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection("Subscriber");

  const doc = await collection.findOne({ "email": body.email });

  if (doc) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Already Subscribed Your Email",
    });
  }

  const result = await collection.insertOne({ email: body.email });

  return NextResponse.json({
    success: true,
    error: false,
    message: "Subscribed Your Email",
    result: result,
  });
}
