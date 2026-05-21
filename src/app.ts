import express from "express";
import menuRoutes from "./interfaces/routes/menuRoutes";

const app = express();
app.use(express.json());
app.use("/api/v1", menuRoutes);

export default app;
