// backend/makeAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function promote() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);

    const email = process.env.ADMIN_EMAIL || "adnanmwu@gmail.com";
    console.log(`Checking user: ${email}...`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User with email ${email} was not found! Have you registered this email yet?`);
      const allUsers = await User.find({}, "email role");
      console.log("Existing users in DB:", allUsers);
    } else {
      console.log(`Current role is: "${user.role}"`);
      user.role = "admin";
      await user.save();
      console.log(`✅ SUCCESS! ${email} is now explicitly set to role: "admin" in MongoDB!`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

promote();