import express from "express";
import { getMonasteries, createMonastery } from "../controllers/monasteryController";

const router = express.Router();

router.get("/", getMonasteries);
router.post("/", createMonastery);

export default router;
