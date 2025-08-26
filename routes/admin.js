import express from "express";
import User from "../models/user.js";
import Pet from "../models/pet.js";
import authMiddleware from "../middleware/middleware.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username email role");
    res.render("admin-users", { users });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

router.get("/pets", authMiddleware, isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner", "username email");
    res.render("admin-pets", { pets });
  } catch (err) {
    res.status(500).send("Error fetching pets");
  }
});

export default router;
