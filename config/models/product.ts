import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
  },
);

const Product = mongoose.model("product", productSchema);
export default Product;
