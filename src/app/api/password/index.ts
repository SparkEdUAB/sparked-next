import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { HttpStatusCode } from 'axios';
import nodemailer from 'nodemailer';

export default async function forgotPassword_(request: Request) {
  const { email } = await request.json();

  try {
    const db = await dbClient();

    if (!db) {
      return new Response(JSON.stringify({ isError: true, code: 'DB_CONNECTION_FAILED' }), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    const user = await db.collection(dbCollections.users.name).findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ isError: true, code: 'USER_NOT_FOUND' }), {
        status: HttpStatusCode.NotFound,
      });
    }

    // Generate a reset token (for simplicity, using a random string)
    const resetToken = Math.random().toString(36).substring(2);

    // Save the reset token in the database
    await db.collection(dbCollections.users.name).updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry: Date.now() + 3600000 } }, // 1 hour expiry
    );

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${process.env.BASE_URL}/reset-password?token=${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ isError: false, code: 'EMAIL_SENT' }), {
      status: HttpStatusCode.Ok,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ isError: true, code: 'UNKNOWN_ERROR' }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
