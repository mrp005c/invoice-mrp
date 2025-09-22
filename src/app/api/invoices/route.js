import { NextResponse } from "next/server";
import clientPromise from "@/lib/moingoDb";

//Post Your Data
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const collName = searchParams.get("email");
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection(`${collName}`);
  const doc = await collection.findOne({ invoiceId: body.invoiceId });

  if (doc) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Your Invoice Already Exists",
    });
  }
  body.createdAt = Date.now();

  const result = await collection.insertOne(body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Your Invoice Added",
    result: result,
  });
}

//Get Your Data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection(email);

  const result = await collection.find({}).toArray();
  if (result.length > 0) {
    return NextResponse.json({
      success: true,
      error: false,
      result: result,
      message: "Invoice Found",
    });
  }
  return NextResponse.json({
    success: false,
    error: true,
    message: "Invoice Not Found !",
  });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const collName = searchParams.get("email");
  const invoiceId = searchParams.get("invoiceId");
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection(`${collName}`);


  const result = await collection.deleteOne({invoiceId});
  
  if (!result) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Your Invoice Couldn't Be Deleted",
    });
  }
  return NextResponse.json({
    success: true,
    error: false,
    message: "Your Invoice Deleted",
    result: result,
  });
}
/* 
export async function PUT(request) {
     let pathName = request.method
   
    return NextNextResponse.json({success: true, data:pathName , name:"Your Put Request"})
}
export async function HEAD(request) {}
 
 
 
 
export async function PATCH(request) {}
 
*/
