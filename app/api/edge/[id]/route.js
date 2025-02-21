import { connectToDB } from "@/app/lib/connectToDB";
import { Edge } from "@/app/lib/Edge/model";
import { Teams } from "@/app/lib/Teams/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedEdge = await Edge.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedEdge) {
      return NextResponse.json(
        { message: "edge data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedEdge },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update edge data:", error);
    return NextResponse.json(
      { message: "Failed to update edge data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const data = await Edge.findOne({ _id: id });
  if (!data) {
    return NextResponse.json(
      { message: "data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(data, { status: 200 });
}
