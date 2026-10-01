const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAlertEmail(sensorData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "sebinmatheweapen@gmail.com",
    subject: "🚨 Water Quality Alert",
    text: `
Alert: Unsafe water detected!

Location: ${sensorData.location}
Status: ${sensorData.status}

Issues:
${sensorData.issues.join(", ")}

Time: ${new Date(sensorData.timestamp).toLocaleString()}
`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendAlertEmail;
