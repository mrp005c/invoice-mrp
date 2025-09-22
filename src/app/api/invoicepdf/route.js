import { NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import Mydocument from "@/components/Mydocument";


// app/api/pdf/route.js

export async function POST(request) {
    const { searchParams } = new URL(request.url);
  const collName = searchParams.get("email");
  const body = await request.json();

  // Create Document Component

  const stream = await ReactPDF.renderToStream(<Mydocument item={body} />);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=example.pdf",
    },
  });
}
