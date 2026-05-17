require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors({
    origin:"*",
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  replyTo: email,
  to: process.env.EMAIL_USER,
  subject: `Portfolio Contact from ${name}`,
  html: `
    <h2>New Contact Message</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Message:</b> ${message}</p>
  `,
});


    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});