const nodemailer = require("nodemailer");

module.exports = async (req, res) => {

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send Mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,

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

          <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
            ${message}
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Email Sent Successfully",
    });

  } catch (error) {

    console.log("MAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};