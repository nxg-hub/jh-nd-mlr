import express from "express";
import dotenv from "dotenv";
import handler from "./api/email/send.js";

dotenv.config();

const app = express();
app.use(express.json());

// Route maps to same handler used by Vercel
app.post("/api/email/send", handler);

app.get("/", (req, res) => {
  res.send("✅ Email service is running. Use POST /api/email/send");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
