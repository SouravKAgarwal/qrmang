import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import db from "@/drizzle";
import { verificationTokens } from "@/drizzle/schema";

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, email, name, token } = body;

  if (!userId || !email || !name || !token) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 100%); padding: 40px 20px;">
  <tr>
    <td align="center">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <tr>
          <td style="padding: 32px 24px 24px; text-align: center;">
            <img src="https://res.cloudinary.com/dpyudeizr/image/upload/v1744575396/unnamed_fguzut.png" alt="QRMang Logo" width="120" style="display: block; margin: 0 auto 16px;" />
            <h1 style="font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; font-size: 24px; font-weight: 700; color: #4f46e5; margin: 0;">Verify Your Email Address</h1>
          </td>
        </tr>
        <!-- Divider -->
        <tr>
          <td style="padding: 0 24px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="height: 1px; background: #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 24px; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; font-size: 16px; line-height: 24px; color: #6b7280;">
            <p style="margin: 0 0 16px;">Hi, ${name},</p>
            <p style="margin: 0 0 16px;">
              Welcome to QRMang! To get started, please verify your email address by clicking the button below:
            </p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
              <tr>
                <td align="center">
                  <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4f46e5, #7c3aed); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: background 0.3s;">Verify Email</a>
                </td>
              </tr>
            </table>
            <p style="margin: 0 0 16px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="margin: 0 0 16px; word-break: break-all; color: #4f46e5;">
              <a href="${verificationUrl}" style="color: #4f46e5; text-decoration: underline;">${verificationUrl}</a>
            </p>
            <p style="margin: 0;">
              This verification link <strong>expires in 60 minutes</strong>.
            </p>
          </td>
        </tr>
        <!-- Divider -->
        <tr>
          <td style="padding: 0 24px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="height: 1px; background: #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 24px; text-align: center; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; font-size: 14px; color: #9ca3af;">
            <p style="margin: 0 0 8px;">Thank you for joining QRMang!</p>
            <p style="margin: 0 0 8px;">The QRMang Team</p>
            <p style="margin: 0;">
              <a href="https://qrmang.vercel.app" style="color: #4f46e5; text-decoration: underline;">qrmang.com</a>
              &nbsp;|&nbsp;
              <a href="mailto:support@qrmang.com" style="color: #4f46e5; text-decoration: underline;">support@qrmang.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  };

  try {
    const verification = await db.insert(verificationTokens).values({
      identifier: email,
      userId: userId,
      token: token,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });

    if (verification) {
      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { message: "Failed to send verification email" },
      { status: 500 },
    );
  }
}
