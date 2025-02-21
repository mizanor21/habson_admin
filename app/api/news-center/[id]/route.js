import { connectToDB } from "@/app/lib/connectToDB";
import { News } from "@/app/lib/NewsCenter/model";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const data = await News.findOne({ _id: id });
  if (!data) {
    return NextResponse.json(
      { message: "data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const data = await req.json();

  await connectToDB();

  try {
    const updated = await News.findByIdAndUpdate(id, data, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updated) {
      return NextResponse.json(
        { message: "data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update data:", error);
    return NextResponse.json(
      { message: "Failed to update data" },
      { status: 500 }
    );
  }
}

