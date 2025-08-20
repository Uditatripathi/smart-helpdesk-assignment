import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Article from "../src/models/Article.js";
import Ticket from "../src/models/Ticket.js";

dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/helpdesk";

async function run() {
  await mongoose.connect(MONGO_URI);

  await User.deleteMany({});
  await Article.deleteMany({});
  await Ticket.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await User.create({ name: "Admin", email: "admin@example.com", passwordHash, role: "admin" });
  const agent = await User.create({ name: "Agent", email: "agent@example.com", passwordHash, role: "agent" });
  const user = await User.create({ name: "User", email: "user@example.com", passwordHash, role: "user" });

  const kb = await Article.insertMany([
    { title: "How to update payment method", body: "Go to Settings > Billing to update cards.", tags: ["billing","payments"], status: "published" },
    { title: "Troubleshooting 500 errors", body: "Check server logs and restart auth module.", tags: ["tech","errors"], status: "published" },
    { title: "Tracking your shipment", body: "Use the tracking link in your order page.", tags: ["shipping","delivery"], status: "published" }
  ]);

  await Ticket.insertMany([
    { title: "Refund for double charge", description: "I was charged twice for order #1234 refund", category: "other", createdBy: user._id },
    { title: "App shows 500 on login", description: "500 error and stack trace mentions auth", category: "other", createdBy: user._id },
    { title: "Where is my package?", description: "Shipment delayed 5 days delivery", category: "other", createdBy: user._id }
  ]);

  console.log("Seeded users (admin/agent/user) with password: password123");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
