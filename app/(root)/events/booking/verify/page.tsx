import { VerifyBooking } from "@/components/verify-booking";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Booking",
};

export default async function VerifyBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingReference?: string }>;
}) {
  const bookingReference = (await searchParams).bookingReference;

  return (
    <div className="flex w-full items-center justify-center">
      <VerifyBooking bookingReference={bookingReference} />
    </div>
  );
}
