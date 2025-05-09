"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const staffRoutes_1 = __importDefault(require("./staffRoutes"));
const router = express_1.default.Router();
router.use("/user", userRoutes_1.default);
router.use("/staff", staffRoutes_1.default);
exports.default = router;
