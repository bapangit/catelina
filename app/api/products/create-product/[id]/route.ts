import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();

    const { id } = await params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        title: body.title,
        price: body.price,
        image: body.image,
        published: true,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save product",
      },
      {
        status: 500,
      }
    );
  }
}