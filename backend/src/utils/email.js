import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"RoomLK" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset for your RoomLK account.</p>
      <p>Click the link below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
      <p>If you did not request this, ignore this email — your password will not change.</p>
    `,
  });
};
