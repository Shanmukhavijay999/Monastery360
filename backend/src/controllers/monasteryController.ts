import { Request, Response } from "express";
import Monastery from "../models/Monastery";

// GET all monasteries
export const getMonasteries = async (req: Request, res: Response) => {
  try {
    const monasteries = await Monastery.find();
    res.json(monasteries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monasteries" });
  }
};

// POST create a monastery
export const createMonastery = async (req: Request, res: Response) => {
  try {
    const { name, location, description } = req.body;
    const newMonastery = new Monastery({ name, location, description });
    await newMonastery.save();
    res.status(201).json(newMonastery);
  } catch (err) {
    res.status(500).json({ error: "Failed to create monastery" });
  }
};
