import express, { Request, Response, NextFunction } from "express";
import menuRoutes from "./interfaces/routes/menuRoutes";

const app = express();
app.use(express.json());
app.use("/api/v1", menuRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
