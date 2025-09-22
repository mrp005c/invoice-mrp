import { NextResponse } from "next/server";
import clientPromise from "@/lib/moingoDb";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();
  const email = searchParams.get("email");

  if (email.length === 0) {
     return NextResponse.json({
      success: false,
      error: true,
      message: "Not Found Email !",
    });
  }
  const client = await clientPromise;
  const db = client.db("Invoice");
  const collection = db.collection("User");

  const updates = {};
  if (body.name && body.name.trim().length > 0) updates.name = body.name;
  if (body.phone && body.phone.trim().length > 0) updates.phone = body.phone;
  if (body.image && body.image.trim().length > 0) updates.image = body.image;
  if (body.birth_date && body.birth_date.trim().length > 0) {
    updates.birth_date = (body.birth_date);
  }
  if (body.address && body.address.trim().length > 0)
    updates.address = body.address;
  if (body.password && body.password.trim().length > 0) {
    // ⚠️ hash password before saving in production
    updates.password = body.password;
  }
 
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "No Changed by User !",
    });
  }

  const doc = await collection.updateOne({ email }, { $set: updates });
  if (doc) {
    return NextResponse.json({
      success: true,
      error: false,
      data: doc,
      message: "Updated Successful",
    });
  }

  return NextResponse.json({
    success: false,
    error: true,
    message: "Updated Failed !",
  });
}
