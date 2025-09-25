import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }


  const { recipient, messageBody, subject, attachment, senderName } = req.body;

  // API key validation
  const apiKeyHeader = req.headers["x-api-key"];
  if (apiKeyHeader !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }


  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === 465, // true for 465, false otherwise
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${senderName || "Payina"}" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: subject,
      html: messageBody,
    };

    // Optional attachment (expects file path or base64 string depending on config)
    if (attachment) {
      mailOptions.attachments = [
        {
          filename: "attachment.txt",
          content: attachment, // could be base64 or text depending on usage
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}
