import nodemailer from "nodemailer";


export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"JOb SEARCH APP✨" <youssefhossam205@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
} 