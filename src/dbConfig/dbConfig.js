import mongoose from "mongoose";

export async function connect() {
  if (mongoose.connection.readyState >= 1) {
    // Already connected
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Initial MongoDB connection error:", error);
    process.exit(1);
  }
}
