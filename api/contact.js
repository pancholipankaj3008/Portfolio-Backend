import nodemailer from "nodemailer";

export default async function handler(req, res) {

  /*
  =========================
  CORS
  =========================
  */

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /*
  =========================
  ONLY POST ALLOWED
  =========================
  */

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    /*
    =========================
    GET DATA
    =========================
    */

    const { name, email, subject, message } = req.body;

    /*
    =========================
    VALIDATION
    =========================
    */

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    /*
    =========================
    NODEMAILER TRANSPORTER
    =========================
    */

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /*
    =========================
    VERIFY CONNECTION
    =========================
    */

    await transporter.verify();

    /*
    =========================
    SEND EMAIL
    =========================
    */

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,

      subject: subject
        ? `Portfolio Contact: ${subject}`
        : `Portfolio Contact from ${name}`,

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2>📩 New Portfolio Message</h2>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Subject:</strong> ${subject || "No Subject"}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div style="
            background:#f4f4f4;
            padding:15px;
            border-radius:8px;
            margin-top:10px;
          ">
            ${message}
          </div>

        </div>
      `,
    });

    /*
    =========================
    SUCCESS RESPONSE
    =========================
    */

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {

    console.log("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
