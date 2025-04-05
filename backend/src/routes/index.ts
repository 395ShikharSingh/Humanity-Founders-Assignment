// index.ts
import express from "express";
import userRouter from "./userRoutes";
import staffRouter from "./staffRoutes";
const router= express.Router();

router.use("/user", userRouter); 
router.use("/staff", staffRouter);

export default router
