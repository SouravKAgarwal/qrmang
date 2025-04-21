"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { ChevronRight, ChevronLeft, Ticket, CheckCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { TicketType } from "@/types";
import { BookingInput, BookingSchema } from "@/validators/booking-validators";
import { valibotResolver } from "@hookform/resolvers/valibot";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface TicketBookingFormProps {
  eventId: string;
  userId: string;
  ticketTypes: TicketType[];
}

export function TicketBookingForm({
  eventId,
  userId,
  ticketTypes,
}: TicketBookingFormProps) {
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const form = useForm<BookingInput>({
    resolver: valibotResolver(BookingSchema),
    defaultValues: {
      ticketType: ticketTypes[0]?.name || "",
      quantity: 1,
      bookingEmail: "",
      bookingPhone: "",
      attendees: [{ name: "", age: 0, aadharNumber: "", gender: "Male" }],
    },
  });

  const { ticketType, quantity, bookingEmail, bookingPhone, attendees } =
    form.watch();

  const selectedTicket = ticketTypes.find(
    (ticket) => ticket.name === ticketType,
  );
  const totalAmount = selectedTicket ? selectedTicket.price * quantity : 0;

  const validateStep = () => {
    switch (step) {
      case 1:
        return !!ticketType && quantity > 0;
      case 2:
        return !!bookingEmail && !!bookingPhone;
      case 3:
        return (
          attendees.length === quantity &&
          attendees.every((a) => a.name && a.age && a.aadharNumber && a.gender)
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCompletedSteps((prev) => new Set(prev).add(step));
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      form.trigger();
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: BookingInput) => {
    if (!validateStep() || step !== 4) return;
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId, eventId }),
      });

      if (!response.ok) throw new Error("Booking request failed");

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe failed to initialize");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) throw error;
    } catch (error) {
      console.error("Booking submission error:", error);
      form.setError("root", { message: "Failed to initiate payment" });
    }
  };

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    switch (step) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
                <CardDescription>
                  Pick your ticket type and quantity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="ticketType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ticket type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ticketTypes.map((ticket) => (
                            <SelectItem key={ticket.name} value={ticket.name}>
                              {ticket.name} - ₹{ticket.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (Max 5)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((qty) => (
                            <SelectItem key={qty} value={qty.toString()}>
                              {qty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>
                  Where should we send your confirmation?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="bookingEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bookingPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="123-456-7890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <CardHeader>
                <CardTitle>Attendee Details</CardTitle>
                <CardDescription>
                  Provide details for all attendees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {attendees.map((_, index) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <h3 className="flex items-center font-semibold">
                      <Ticket className="mr-2 h-5 w-5" /> Attendee {index + 1}
                    </h3>
                    <FormField
                      control={form.control}
                      name={`attendees.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`attendees.${index}.age`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              onKeyDown={(e) => {
                                if (
                                  e.key === "ArrowUp" ||
                                  e.key === "ArrowDown"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              placeholder="25"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`attendees.${index}.aadharNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123456789012"
                              maxLength={12}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`attendees.${index}.gender`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                {attendees.length < quantity && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.setValue("attendees", [
                        ...attendees,
                        { name: "", age: 0, aadharNumber: "", gender: "Male" },
                      ])
                    }
                    className="w-full"
                  >
                    Add Attendee ({attendees.length}/{quantity})
                  </Button>
                )}
                {form.formState.errors.attendees && (
                  <p className="text-sm">
                    {form.formState.errors.attendees.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Receipt</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{ticketType}</span>
                    <span className="text-sm">
                      ₹{selectedTicket?.price.toFixed(2)} x {quantity} ticket(s)
                    </span>
                  </div>
                  <span className="font-semibold">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="space-y-3">
                  {attendees.map((attendee, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">Attendee {index + 1}</p>
                      <p>{attendee.name}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm">Confirmation will be sent to:</p>
                  <p className="text-sm">{bookingEmail}</p>
                  <p className="text-sm">{bookingPhone}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Processing..." : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Ticket Selection",
                      "Contact Details",
                      "Attendee Details",
                      "Review & Pay",
                    ].map((label, index) => {
                      const stepNum = index + 1;
                      return (
                        <li
                          key={stepNum}
                          className="flex items-center space-x-3"
                        >
                          {completedSteps.has(stepNum) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : step === stepNum ? (
                            <Ticket className="h-5 w-5" />
                          ) : (
                            <Ticket className="h-5 w-5" />
                          )}
                          <span className="text-sm">{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="w-full md:w-2/3">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ChevronLeft /> Back
                </Button>
                {step < 4 ? (
                  <Button onClick={nextStep} disabled={!validateStep()}>
                    Next <ChevronRight />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
