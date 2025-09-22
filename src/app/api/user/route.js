import { NextResponse } from "next/server";
import clientPromise from "@/lib/moingoDb";

//Post Your Data
export async function POST(request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection("User");

  const doc = await collection.findOne({ email: body.email });
  if (doc) {
    return Response.json({
      success: false,
      error: true,
      message: "User Already Exists! Try Again...",
    });
  }

  const result = await collection.insertOne(body);

  return Response.json({
    success: true,
    error: false,
    message: "Register Successful, Log In Now...",
    result: result,
  });
}

//Get Your Data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection("User");

  const doc = await collection.findOne({ email });
  if (doc) {
    return NextResponse.json({
      success: true,
      error: false,
      data: doc,
      message: "User Found",
    });
  }
  return NextResponse.json({
    success: false,
    error: true,
    message: "User Not Found !",
  });
}


/* 
export async function DELETE(request) {}
export async function HEAD(request) {}
 
 
 
 
export async function PATCH(request) {}
 
*/
