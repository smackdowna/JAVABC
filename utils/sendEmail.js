const nodeMailer = require("nodemailer");

// Remove the incorrect syntax from the import statement
const createTransport = nodeMailer.createTransport;

const sendEmail = async (to, subject, text) => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
