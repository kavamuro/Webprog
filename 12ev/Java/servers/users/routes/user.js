// import {
//   deleteUser,
//   getAllUsers,
//   getUserById,
//   saveUser,
//   updateUser,
// } from "../controllers/users.js";
import * as usersController from "../controllers/users.js";

// import express from "express";
// const router = express.Router();

import { Router } from "express";
const router = Router();

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getUserById);

router.post("/", usersController.saveUser);

router.put("/:id", usersController.updateUser);

router.delete("/:id", usersController.deleteUser);

export default router;
