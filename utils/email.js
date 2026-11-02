const nodemailer = require('nodemailer');

module.exports = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Tocka Ayman <tocka.ayman@outlook.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  const startDate = new Date();
  console.log(`Sending the email ${startDate}`);
  await transport.sendMail(mailOptions);
  console.log(`Sending the email is doe ${new Date() - startDate}`);
};

// Sending the email Sat Oct 31 2026 18:12:35 GMT+0200 (Eastern European Standard Time)
