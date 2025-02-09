import { connectToDB } from "@/app/lib/connectToDB";
import { MouseMovement } from "@/app/lib/Home/mouseMovement";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedMouseMovement = await MouseMovement.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Returns the updated document
        runValidators: true, // Ensures model validation
      }
    );

    if (!updatedMouseMovement) {
      return NextResponse.json(
        { message: "MouseMovement data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedMouseMovement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update MouseMovement data:", error);
    return NextResponse.json(
      { message: "Failed to update MouseMovement data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const job = await MouseMovement.findOne({ _id: id });
  if (!job) {
    return NextResponse.json(
      { message: "MouseMovement data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(job, { status: 200 });
}
