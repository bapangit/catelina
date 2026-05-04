import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    productId:String,
    size:String
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
