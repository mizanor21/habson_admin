import { connectToDB } from "@/app/lib/connectToDB";
import { JobHero } from "@/app/lib/JobHero/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedHero = await JobHero.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedHero) {
      return NextResponse.json(
        { message: "Job hero data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedHero },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update hero data:", error);
    return NextResponse.json(
      { message: "Failed to update hero data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const hero = await JobHero.findOne({ _id: id });
  if (!hero) {
    return NextResponse.json(
      { message: "hero data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(hero, { status: 200 });
}
