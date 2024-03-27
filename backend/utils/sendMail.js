import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "abhisamadhiya14@gmail.com",
    pass: "mssf gzye lamc vnef",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(to,subject,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'abhisamadhiya14@gmail.com', // sender address
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
