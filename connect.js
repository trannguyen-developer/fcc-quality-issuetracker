require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Thay link dưới bằng connection string của bạn
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
