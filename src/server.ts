import express from "express";
import mongoose from "mongoose";
import menuRoutes from "./interfaces/routes/menuRoutes";

const app = express();
const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/api-menu";

app.use(express.json());
app.use("/api/v1", menuRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
