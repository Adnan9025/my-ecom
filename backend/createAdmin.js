// backend/createAdmin.js

import User from "./models/User.js";
import config from "./config.js";

export default async function createAdminIfNotExists() {
  try {
    const existingAdmin = await User.findOne({
      email: config.adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    await User.create({
      email: config.adminEmail,
      password: config.adminPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}