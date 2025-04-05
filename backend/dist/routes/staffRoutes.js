"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// 1. Zod schema for staff signup
const staffSignupSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string(),
});
// 2. Zod schema for staff login
const staffLoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string(),
});
// 3. Zod schema for doctor addition
const doctorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    degree: zod_1.z.string().min(1, "Degree is required"),
    fees: zod_1.z.number().positive("Fees must be positive"),
});
// --- POST /api/staff/signup ---
const signupStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = staffSignupSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.errors });
        return;
    }
    const { username, password } = parsed.data;
    try {
        const existing = yield prisma.staff.findUnique({ where: { username } });
        if (existing) {
            res.status(409).json({ message: "Username already registered." });
            return;
        }
        const newStaff = yield prisma.staff.create({
            data: {
                username,
                passwordHash: password // Note: In production, hash the password!
            },
        });
        res.status(201).json({ message: "Staff registered successfully.", data: newStaff });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Something went wrong." });
    }
});
// --- POST /api/staff/login ---
const loginStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = staffLoginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.errors });
        return;
    }
    const { username, password } = parsed.data;
    try {
        const staff = yield prisma.staff.findUnique({ where: { username } });
        if (!staff || staff.passwordHash !== password) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = (0, auth_1.generateToken)(username);
        res.json({ token });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Something went wrong." });
    }
});
// --- POST /api/staff/add-doctor ---
const addDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = doctorSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.errors });
        return;
    }
    const { name, degree, fees } = parsed.data;
    try {
        const newDoctor = yield prisma.doctor.create({
            data: { name, degree, fees },
        });
        res.status(201).json({ message: "Doctor added successfully.", data: newDoctor });
    }
    catch (err) {
        console.error("Add doctor error:", err);
        res.status(500).json({ message: "Failed to add doctor." });
    }
});
// --- GET /api/staff/appointments ---
const getAllAppointments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield prisma.appointment.findMany({
            include: { doctor: true },
            orderBy: { appointmentDate: "asc" },
        });
        res.json({ data: appointments });
    }
    catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ message: "Failed to retrieve appointments." });
    }
});
router.post("/signup", signupStaff);
router.post("/login", loginStaff);
router.post("/add-doctor", auth_1.verifyToken, addDoctor);
router.get("/appointments", auth_1.verifyToken, getAllAppointments);
exports.default = router;
