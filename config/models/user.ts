import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    role:{type:String,default:"user"} // Roles - "user", "admin"
  },
);

const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
