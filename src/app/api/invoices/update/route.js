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
  //   const doc = await collection.findOne({ invoiceId: body.invoiceId });
  delete body.id;
  body.updatedAt = Date.now();
  
  const result = await collection.updateOne(
    { invoiceId: body.invoiceId },
    { $set: body }
  );

  if (!result) {
    return Response.json({
      success: false,
      error: true,
      message: "Your Invoice  Not Updated",
    });
  }
  return Response.json({
    success: true,
    error: false,
    message: "Your Invoice Updated",
    result: result,
  });
}
