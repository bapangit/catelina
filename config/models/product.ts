import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: String,
    price:String,
    image:String,
    isdraft:Boolean
  },
);

const Product = mongoose.model("product", productSchema);
export default Product;
