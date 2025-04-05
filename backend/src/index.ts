import express from "express";
import cors from "cors"; 
import rootRouter from "./routes/index";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "https://humanity-founders-assignment.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

app.use(express.json());
app.use("/hospital", rootRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});