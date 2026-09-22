// resetAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    email: String,
    role: String,
  },
  { strict: false }
);

const User = mongoose.model("User", userSchema);

async function reset() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to:", uri.split("@")[1] || uri);
    await mongoose.connect(uri);

    // Delete any existing admin user
    const result = await User.deleteMany({
      $or: [
        { role: "admin" },
        { email: process.env.ADMIN_EMAIL || "adnanmwu@gmail.com" },
      ],
    });

    console.log(`Deleted ${result.deletedCount} admin account(s).`);
    console.log("Database is now clean!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

reset();