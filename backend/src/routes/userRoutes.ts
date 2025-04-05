import express, { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

// Zod schema for booking
const bookingSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  description: z.string().optional(),
  doctorId: z.number().int().positive("Doctor ID must be positive"),
});

// POST /api/book-appointment
const bookAppointment: RequestHandler = async (req, res) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.errors });
      return;
    }

    const { userName, phone, appointmentDate, description, doctorId } = parsed.data;

    const newAppointment = await prisma.appointment.create({
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
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// GET /api/appointments?phone=12345&userName=John
const getAppointments: RequestHandler = async (req, res) => {
  try {
    const { phone, userName } = req.query;

    if (!phone || !userName) {
      res.status(400).json({ message: "Phone and name are required." });
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        phone: String(phone),
        userName: String(userName),
      },
      include: { doctor: true },
      orderBy: { appointmentDate: "asc" },
    });

    res.json({ data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Unable to fetch appointments." });
  }
};

// GET /api/user/doctors
const getAllDoctors: RequestHandler = async (_req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Unable to fetch doctors." });
  }
};

router.get("/doctors", getAllDoctors);
router.post("/book-appointment", bookAppointment);
router.get("/appointments", getAppointments);

export default router;
