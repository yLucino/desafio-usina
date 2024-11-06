import express from "express";

import { getUsers } from "../../controllers/forRecommendedPage/recommended.controller.js";

const router = express.Router();

router.get("/users/:username", getUsers);

export default router;