import { formatDate } from "@/lib/dashboard/admin/utils";
import { NextResponse } from "next/server";
import twilio from "twilio";

interface BookingData {
  eventTitle: string;
  bookingDate: string;
  sessionId: string;
  eventStart: string;
  eventImage?: string;
}

interface BookingRequestBody {
  phone: string;
  userId: string;
  name: string;
  data: BookingData;
}

interface BookingResponse {
  success: boolean;
  messageSid: string | null;
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function POST(
  request: Request,
): Promise<NextResponse<BookingResponse | { error: string }>> {
  const { phone, name, data } = (await request.json()) as BookingRequestBody;

  if (
    !phone ||
    !name ||
    !data?.eventTitle ||
    !data?.bookingDate ||
    !data?.eventStart
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_WHATSAPP_NUMBER
  ) {
    console.error("Missing Twilio credentials:", {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    });
    return NextResponse.json(
      { error: "Twilio credentials not configured" },
      { status: 500 },
    );
  }

  const messageBody = `Hurray!\n\nHello ${name}, your booking for the event *"${data.eventTitle}"* on ${formatDate(data.eventStart)} is confirmed!\n\nClick on the below link to view the ticket:\n${process.env.NEXT_PUBLIC_BASE_URL}/events/booking/success?session_id=${data.sessionId}`;

  try {
    const message = await client.messages.create({
      to: "whatsapp:+916001386472",
      from: "whatsapp:14155238886",
      body: messageBody,
      ...(data.eventImage && { mediaUrl: [data.eventImage] }),
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
    });
  } catch (error) {
    console.error("Twilio API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send WhatsApp message",
      },
      { status: 500 },
    );
  }
}
