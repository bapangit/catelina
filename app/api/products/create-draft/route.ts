import { NextResponse } from "next/server";
import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";

export async function POST() {
  try {
    await connectDB();

    const product = await Product.create({
      title: "product title",
      price:"100",
      image: "image_url",
      published: false,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create draft product",
      },
      {
        status: 500,
      }
    );
  }
}