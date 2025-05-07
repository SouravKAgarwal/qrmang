import {
  cancelledTemplate,
  completedTemplate,
  expiredTemplate,
  pendingTemplate,
} from "@/templates";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface EmailRequestBody {
  name: string;
  data: {
    event: { title: string };
    booking: {
      bookingEmail: string;
      paymentStatus: "pending" | "completed" | "failed" | "expired";
      bookingReference: string;
      ticketInfo: {
        ticketType: string;
        totalTickets: number;
        totalAmount: number;
      };
      stripeSessionId: string;
    };
  };
}

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const { name, data } = (await req.json()) as EmailRequestBody;

  if (!name || !data) {
    return NextResponse.json({ error: "Data is required" }, { status: 400 });
  }

  const mailOptions = {
    from: AUTH_EMAIL,
    to: data.booking.bookingEmail,
    subject: `Booking Confirmation for ${data.event.title}`,
    html:
      data.booking.paymentStatus === "completed"
        ? completedTemplate(name, data)
        : data.booking.paymentStatus === "pending"
          ? pendingTemplate(name, data)
          : data.booking.paymentStatus === "expired"
            ? expiredTemplate(name, data)
            : cancelledTemplate(name, data),
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Booking email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in sendBookingConfirmAction API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
