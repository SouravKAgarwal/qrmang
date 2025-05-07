export function completedTemplate(
  name: string,
  data: {
    event: { title: string };
    booking: {
      bookingReference: string;
      ticketInfo: {
        ticketType: string;
        totalTickets: number;
        totalAmount: number;
      };
      stripeSessionId: string;
    };
  },
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 100%); padding: 40px 20px; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="padding: 32px 24px 24px; text-align: center;">
                <img src="https://res.cloudinary.com/dpyudeizr/image/upload/v1744839539/unnamed_cavzt9.png" alt="Event Platform Logo" width="80" style="display: block; margin: 0 auto 16px;" />
                <h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0;">Booking Confirmation</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="height: 1px; background: #e5e7eb;"></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px; font-size: 16px; line-height: 24px; color: #374151;">
                <p style="margin: 0 0 16px;">Dear ${name},</p>
                <p style="margin: 0 0 16px;">
                  Thank you for your booking! We're thrilled to confirm your attendance for <strong>${data.event.title}</strong>. Below are your booking details and event pass.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 24px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px;">Booking Receipt</h2>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 16px;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                      <strong>Event:</strong> ${data.event.title}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                      <strong>Booking Reference:</strong> ${data.booking.bookingReference}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                      <strong>Ticket Type:</strong> ${data.booking.ticketInfo.ticketType}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                      <strong>Quantity:</strong> ${data.booking.ticketInfo.totalTickets}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                      <strong>Total Amount:</strong> ₹${data.booking.ticketInfo.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 24px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px;">Your Event Pass</h2>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                      <strong>Booking Reference:</strong> ${data.booking.bookingReference}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0;">
                      <a href="${baseUrl}/events/booking/success?session_id=${data.booking.stripeSessionId}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px; transition: background 0.2s;">View Your Ticket</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">
                      Scan the QR code at the event entrance for check-in. Ensure your device is charged or bring a printed copy.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="height: 1px; background: #e5e7eb;"></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px; text-align: center; font-size: 14px; color: #6b7280;">
                <p style="margin: 0 0 8px;">Thank you for choosing our platform!</p>
                <p style="margin: 0 0 8px;">Your Event Team</p>
                <p style="margin: 0;">
                  <a href="https://your-event-platform.com" style="color: #4f46e5; text-decoration: none;">your-event-platform.com</a>
                   | 
                  <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function cancelledTemplate(
  name: string,
  data: {
    event: { title: string };
    booking: {
      bookingReference: string;
      ticketInfo: {
        ticketType: string;
        totalTickets: number;
        totalAmount: number;
      };
      stripeSessionId: string;
    };
  },
): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 100%); padding: 40px 20px; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 32px 24px 24px; text-align: center;">
                  <img src="https://res.cloudinary.com/dpyudeizr/image/upload/v1744839539/unnamed_cavzt9.png" alt="Event Platform Logo" width="80" style="display: block; margin: 0 auto 16px;" />
                  <h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0;">Booking Cancelled</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 24px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="height: 1px; background: #e5e7eb;"></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; font-size: 16px; line-height: 24px; color: #374151;">
                  <p style="margin: 0 0 16px;">Dear ${name},</p>
                  <p style="margin: 0 0 16px;">
                    We regret to inform you that your booking for <strong>${data.event.title}</strong> has been cancelled. This may have occurred due to payment issues or a cancellation request.
                  </p>
                  <p style="margin: 0 0 16px;">
                    If you believe this is an error or have any questions, please contact our support team at <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 24px 24px;">
                  <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px;">Booking Details</h2>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 16px;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                        <strong>Event:</strong> ${data.event.title}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                        <strong>Booking Reference:</strong> ${data.booking.bookingReference}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                        <strong>Status:</strong> Cancelled
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 24px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="height: 1px; background: #e5e7eb;"></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center; font-size: 14px; color: #6b7280;">
                  <p style="margin: 0 0 8px;">We hope to serve you again in the future!</p>
                  <p style="margin: 0 0 8px;">Your Event Team</p>
                  <p style="margin: 0;">
                    <a href="https://your-event-platform.com" style="color: #4f46e5; text-decoration: none;">your-event-platform.com</a>
                    &nbsp;|&nbsp;
                    <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
}

export function expiredTemplate(
  name: string,
  data: {
    event: { title: string };
    booking: {
      bookingReference: string;
      ticketInfo: {
        ticketType: string;
        totalTickets: number;
        totalAmount: number;
      };
      stripeSessionId: string;
    };
  },
): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 100%); padding: 40px 20px; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 32px 24px 24px; text-align: center;">
            <img src="https://res.cloudinary.com/dpyudeizr/image/upload/v1744839539/unnamed_cavzt9.png" alt="Event Platform Logo" width="80" style="display: block; margin: 0 auto 16px;" />
            <h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0;">Booking Session Expired</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="height: 1px; background: #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; font-size: 16px; line-height: 24px; color: #374151;">
            <p style="margin: 0 0 16px;">Dear ${name},</p>
            <p style="margin: 0 0 16px;">
              We’re sorry, but your booking session for <strong>${data.event.title}</strong> has expired. This typically happens if the payment was not completed within the allowed time.
            </p>
            <p style="margin: 0 0 16px;">
              You can try booking again by visiting our website. If you need assistance, please contact our support team at <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 24px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px;">Booking Details</h2>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 16px;">
              <tr>
                <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                  <strong>Event:</strong> ${data.event.title}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                  <strong>Booking Reference:</strong> ${data.booking.bookingReference}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                  <strong>Status:</strong> Expired
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="height: 1px; background: #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; text-align: center; font-size: 14px; color: #6b7280;">
            <p style="margin: 0 0 8px;">We hope to see you at a future event!</p>
            <p style="margin: 0 0 8px;">Your Event Team</p>
            <p style="margin: 0;">
              <a href="https://your-event-platform.com" style="color: #4f46e5; text-decoration: none;">your-event-platform.com</a>
               | 
              <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function pendingTemplate(
  name: string,
  data: {
    event: { title: string };
    booking: {
      bookingReference: string;
      ticketInfo: {
        ticketType: string;
        totalTickets: number;
        totalAmount: number;
      };
      stripeSessionId: string;
    };
  },
): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 100%); padding: 40px 20px; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 32px 24px 24px; text-align: center;">
            <img src="https://res.cloudinary.com/dpyudeizr/image/upload/v1744839539/unnamed_cavzt9.png" alt="Event Platform Logo" width="80" style="display: block; margin: 0 auto 16px;" />
            <h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0;">Booking Payment Pending</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="height: 1px; background: #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; font-size: 16px; line-height: 24px; color: #374151;">
            <p style="margin: 0 0 16px;">Dear ${name},</p>
            <p style="margin: 0 0 16px;">
              Thank you for your booking attempt for <strong>${data.event.title}</strong>. Your payment is currently being processed, and we will notify you once it has been confirmed.
            </p>
            <p style="margin: 0 0 16px;">
              If you have any questions or need assistance, please contact our support team at <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 24px;">
            <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 16px;">Booking Details</h2>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 16px;">
              <tr>
                <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                  <strong>Event:</strong> ${data.event.title}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                  <strong>Booking Reference:</strong> ${data.booking.bookingReference}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 16px; color: #111827;">
                  <strong>Status:</strong> Pending
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="height: 1px; background: #e5e7eb;"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; text-align: center; font-size: 14px; color: #6b7280;">
            <p style="margin: 0 0 8px;">We look forward to confirming your booking soon!</p>
            <p style="margin: 0 0 8px;">Your Event Team</p>
            <p style="margin: 0;">
              <a href="https://your-event-platform.com" style="color: #4f46e5; text-decoration: none;">your-event-platform.com</a>
               | 
              <a href="mailto:support@your-event-platform.com" style="color: #4f46e5; text-decoration: none;">support@your-event-platform.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
