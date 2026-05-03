import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/DBConnect";
import Product from "@/config/models/product";

type ImageField = "image1" | "image2";

const getCloudinaryPublicId = (imageUrl: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured");
  }

  const url = new URL(imageUrl);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const uploadIndex = pathParts.indexOf("upload");

  if (url.hostname !== "res.cloudinary.com" || pathParts[0] !== cloudName || uploadIndex === -1) {
    throw new Error("Invalid Cloudinary image URL");
  }

  const partsAfterUpload = pathParts.slice(uploadIndex + 1);
  const versionIndex = partsAfterUpload.findIndex((part) => /^v\d+$/.test(part));
  const publicIdParts =
    versionIndex === -1 ? partsAfterUpload : partsAfterUpload.slice(versionIndex + 1);

  const publicIdWithExtension = publicIdParts.join("/");

  if (!publicIdWithExtension) {
    throw new Error("Cloudinary public id was not found");
  }

  return decodeURIComponent(publicIdWithExtension.replace(/\.[^/.]+$/, ""));
};

const deleteFromCloudinary = async (imageUrl: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary delete credentials are not configured");
  }

  const publicId = getCloudinaryPublicId(imageUrl);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp,
    api_key: apiKey,
    signature,
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body,
  });
  const data = await response.json();

  if (!response.ok || (data.result !== "ok" && data.result !== "not found")) {
    throw new Error(data.error?.message || "Failed to delete Cloudinary image");
  }

  return data;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      imageField,
      imageUrl,
      clearProductImage = false,
    }: {
      productId?: string;
      imageField?: ImageField;
      imageUrl?: string;
      clearProductImage?: boolean;
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 },
      );
    }

    if (clearProductImage && (!productId || (imageField !== "image1" && imageField !== "image2"))) {
      return NextResponse.json(
        { success: false, message: "Product ID and image field are required" },
        { status: 400 },
      );
    }

    await deleteFromCloudinary(imageUrl);

    if (clearProductImage && productId && imageField) {
      await connectDB();
      await Product.findOneAndUpdate(
        {
          _id: productId,
          [imageField]: imageUrl,
        },
        {
          [imageField]: "",
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete image",
      },
      {
        status: 500,
      },
    );
  }
}
