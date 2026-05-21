import { Router } from "express";
import { MenuController } from "../controllers/MenuController";

const router = Router();
const controller = new MenuController();

router.post("/menu", (req, res) => controller.create(req, res));
router.delete("/menu/:id", (req, res) => controller.delete(req, res));
router.get("/menu", (req, res) => controller.getAll(req, res));

export default router;
