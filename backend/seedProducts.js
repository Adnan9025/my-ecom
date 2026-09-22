// backend/seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
  {
    name: "MacBook Pro 16-inch M3",
    description: "Apple M3 Pro chip with 12-core CPU, 18-core GPU, 18GB Unified Memory, and 512GB SSD Storage. Liquid Retina XDR display.",
    price: 2499,
    category: "laptops",
    stock: 15,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dell XPS 15 OLED",
    description: "Intel Core i7-13700H, NVIDIA GeForce RTX 4060, 32GB RAM, 1TB SSD, 3.5K OLED Touch Display.",
    price: 1899,
    category: "laptops",
    stock: 20,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "iPhone 15 Pro Max Titanium",
    description: "A17 Pro chip, Aerospace-grade titanium design, 48MP main camera with 5x optical zoom, USB-C support.",
    price: 1199,
    category: "phones",
    stock: 25,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "200MP camera with Galaxy AI, Snapdragon 8 Gen 3, Titanium Gray, built-in S Pen.",
    price: 1299,
    category: "phones",
    stock: 18,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling with two processors and 8 microphones. Up to 30-hour battery life with quick charging.",
    price: 399,
    category: "headphones",
    stock: 40,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Apple Watch Ultra 2",
    description: "Rugged 49mm titanium case, precision dual-frequency GPS, up to 36 hours battery life, 100m water resistance.",
    price: 799,
    category: "watches",
    stock: 12,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bose QuietComfort Ultra",
    description: "World-class noise cancellation, breakthrough spatialized audio for more immersive listening, and premium materials.",
    price: 429,
    category: "headphones",
    stock: 30,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Garmin Fenix 7 Pro Sapphire Solar",
    description: "Multisport GPS watch with scratch-resistant Power Sapphire solar charging lens and built-in LED flashlight.",
    price: 899,
    category: "watches",
    stock: 8,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);

    // Clear any existing products
    await Product.deleteMany({});
    console.log("Cleared old products.");

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${inserted.length} products into MongoDB!`);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();