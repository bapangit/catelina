import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: String,
    description:String,
    price: String,
    prevPrice:String,
    image1: String,
    image2: String,
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.product || mongoose.model("product", productSchema);
export default Product;
