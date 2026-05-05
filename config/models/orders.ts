import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user:String,
    productId:String,
    size:String,
    paymentMethod:String
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
