const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to My App 🎉",
      html: `
        <h2>Xin chào ${name} 👋</h2>
        <p>Tài khoản của bạn đã được tạo thành công!</p>
        <p>Chúc bạn sử dụng hệ thống vui vẻ 🚀</p>
      `,
    });

    console.log("Email sent to:", toEmail);
  } catch (error) {
    console.log("Send mail error:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
};
