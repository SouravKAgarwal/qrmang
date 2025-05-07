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
    <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <VerifyBooking bookingReference={bookingReference} />
    </div>
  );
}
