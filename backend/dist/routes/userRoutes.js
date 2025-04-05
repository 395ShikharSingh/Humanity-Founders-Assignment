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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Zod schema for booking
const bookingSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1, "Name is required"),
    phone: zod_1.z.string().min(10, "Phone must be at least 10 digits"),
    appointmentDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    description: zod_1.z.string().optional(),
    doctorId: zod_1.z.number().int().positive("Doctor ID must be positive"),
});
// POST /api/book-appointment
const bookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = bookingSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error.errors });
            return;
        }
        const { userName, phone, appointmentDate, description, doctorId } = parsed.data;
        const newAppointment = yield prisma.appointment.create({
            data: {
                userName,
                phone,
                appointmentDate: new Date(appointmentDate),
                description,
                doctor: { connect: { id: doctorId } },
            },
        });
        res.status(201).json({
            message: "Appointment booked successfully.",
            data: newAppointment,
        });
    }
    catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
});
// GET /api/appointments?phone=12345&userName=John
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, userName } = req.query;
        if (!phone || !userName) {
            res.status(400).json({ message: "Phone and name are required." });
            return;
        }
        const appointments = yield prisma.appointment.findMany({
            where: {
                phone: String(phone),
                userName: String(userName),
            },
            include: { doctor: true },
            orderBy: { appointmentDate: "asc" },
        });
        res.json({ data: appointments });
    }
    catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Unable to fetch appointments." });
    }
});
// GET /api/user/doctors
const getAllDoctors = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield prisma.doctor.findMany({
            orderBy: { name: 'asc' }
        });
        res.json({ data: doctors });
    }
    catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Unable to fetch doctors." });
    }
});
router.get("/doctors", getAllDoctors);
router.post("/book-appointment", bookAppointment);
router.get("/appointments", getAppointments);
exports.default = router;
