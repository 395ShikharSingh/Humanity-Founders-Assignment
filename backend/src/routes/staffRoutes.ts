import express, { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { generateToken, verifyToken } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// 1. Zod schema for staff signup
const staffSignupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string(),
});

// 2. Zod schema for staff login
const staffLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string(),
});

// 3. Zod schema for doctor addition
const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  degree: z.string().min(1, "Degree is required"),
  fees: z.number().positive("Fees must be positive"),
});

// --- POST /api/staff/signup ---
const signupStaff: RequestHandler = async (req, res) => {
  const parsed = staffSignupSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.errors });
    return;
  }

  const { username, password } = parsed.data;

  try {
    const existing = await prisma.staff.findUnique({ where: { username } });

    if (existing) {
      res.status(409).json({ message: "Username already registered." });
      return;
    }

    const newStaff = await prisma.staff.create({
      data: { 
        username,
        passwordHash: password // Note: In production, hash the password!
      },
    });

    res.status(201).json({ message: "Staff registered successfully.", data: newStaff });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// --- POST /api/staff/login ---
const loginStaff: RequestHandler = async (req, res) => {
  const parsed = staffLoginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.errors });
    return;
  }

  const { username, password } = parsed.data;

  try {
    const staff = await prisma.staff.findUnique({ where: { username } });

    if (!staff || staff.passwordHash !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(username);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// --- POST /api/staff/add-doctor ---
const addDoctor: RequestHandler = async (req, res) => {
  const parsed = doctorSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.errors });
    return;
  }

  const { name, degree, fees } = parsed.data;

  try {
    const newDoctor = await prisma.doctor.create({
      data: { name, degree, fees },
    });

    res.status(201).json({ message: "Doctor added successfully.", data: newDoctor });
  } catch (err) {
    console.error("Add doctor error:", err);
    res.status(500).json({ message: "Failed to add doctor." });
  }
};

// --- GET /api/staff/appointments ---
const getAllAppointments: RequestHandler = async (_req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { doctor: true },
      orderBy: { appointmentDate: "asc" },
    });

    res.json({ data: appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to retrieve appointments." });
  }
};

router.post("/signup", signupStaff);
router.post("/login", loginStaff);
router.post("/add-doctor", verifyToken, addDoctor);
router.get("/appointments", verifyToken, getAllAppointments);

export default router;
