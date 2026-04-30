import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: String,
    price: String,
    image: String,
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.product || mongoose.model("product", productSchema);
export default Product;
