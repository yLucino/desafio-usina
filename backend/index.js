import express from 'express';
import cors from 'cors';

import loginAndRegisterPageRouter from "./routers/forLoginPage/loginAndRegister.router.js";
import homePageRouter from "./routers/forHomePage/home.router.js";
import recommendedPageRouter from "./routers/forRecommendedPage/recommended.router.js"

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", loginAndRegisterPageRouter);
app.use("/home", homePageRouter);
app.use("/recommended", recommendedPageRouter);

const port = 8801;
app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
})