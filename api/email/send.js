import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    recipient,
    messageBody,
    subject,
    senderName,
    inlineLogoBase64,   // Base64 string for inline logo (optional)
    attachments         // Array of attachments [{ filename, contentBase64, contentType }]
  } = req.body;

  // --- API key validation ---
  const apiKeyHeader = req.headers["x-api-key"];
  if (!apiKeyHeader || apiKeyHeader !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailAttachments = [];

    // Inline logo
    if (inlineLogoBase64) {
      emailAttachments.push({
        filename: "nxg-logo.png",
        content: Buffer.from(inlineLogoBase64, "base64"),
        cid: "nxgLogo",  // matches <img src="cid:nxgLogo">
      });
    }

    // Other attachments (PDF, images, text, etc.)
    if (attachments && Array.isArray(attachments)) {
      attachments.forEach(att => {
        if (att.filename && att.contentBase64) {
          emailAttachments.push({
            filename: att.filename,
            content: Buffer.from(att.contentBase64, "base64"),
            contentType: att.contentType || undefined, // optional, Nodemailer can infer
          });
        }
      });
    }

    const mailOptions = {
      from: `"${senderName || "NXG JOB HUB"}" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: subject,
      html: messageBody,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}
