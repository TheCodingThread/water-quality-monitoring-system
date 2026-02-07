const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sebinmatheweapen@gmail.com",
    pass: "buayyswyivqkcewf",
  },
});

async function sendAlertEmail(sensorData) {
  const mailOptions = {
    from: "sebineapenwaterqualityauthority@gmail.com",
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
