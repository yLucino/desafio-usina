import express from "express";

import { postRegisterNewUser, postSearchLoginAndRegister } from "../../controllers/forLoginPage/loginAndRegister.controller.js";

const router = express.Router();

router.post("/user/login", postSearchLoginAndRegister);
router.post("/user/register", postRegisterNewUser);

export default router;