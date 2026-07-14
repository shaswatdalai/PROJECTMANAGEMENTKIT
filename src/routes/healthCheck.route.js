import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controller.js";

const router = Router();
router.get("/", healthCheck);
router.get("/api/v1/healthcheck", healthCheck);// /api/v1/healthcheck ka mtlb hai ki when someone asks that ,go to healthcheck

export default router;