import { NextResponse } from "next/server";
import clientPromise from "@/lib/moingoDb";

//Post Your Data
export async function POST(request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection("Message");

  // const doc = await collection.findOne();

  
  const result = await collection.insertOne(body);
  
  if (!result) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Failed To Send Message !",
    });
  }

  return NextResponse.json({
    success: true,
    error: false,
    message: "Thanks form Contact us",
    result: result,
  });
}
