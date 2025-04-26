"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import {
  ChevronRight,
  ChevronLeft,
  Ticket,
  CheckCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { TicketType } from "@/types";
import { BookingInput, BookingSchema } from "@/validators/booking-validators";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface TicketBookingFormProps {
  eventId: string;
  userId: string;
  ticketTypes: TicketType[];
  maxTickets: number;
}

export function TicketBookingForm({
  eventId,
  userId,
  ticketTypes,
  maxTickets,
}: TicketBookingFormProps) {
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [remainingTickets, setRemainingTickets] = useState<
    Record<string, number>
  >(
    ticketTypes.reduce(
      (acc, ticket) => ({ ...acc, [ticket.name]: ticket.seatsRemaining }),
      {},
    ),
  );
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (selectedTicket && remainingTickets[selectedTicket.name] !== undefined) {
      const available = remainingTickets[selectedTicket.name];
      if (quantity > available) {
        form.setValue("quantity", available);
        toast.warning(
          `Only ${available} tickets remaining for ${selectedTicket.name}`,
        );
      }
    }
  }, [ticketType, quantity, remainingTickets]);

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          !!ticketType &&
          quantity > 0 &&
          quantity <= (remainingTickets[ticketType] || maxTickets)
        );
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      form.trigger();
      toast.error("Please fill all required fields correctly");
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: BookingInput) => {
    if (!validateStep() || step !== 4) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId, eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Booking request failed");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe failed to initialize");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) throw error;
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate payment",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

    switch (step) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                  Select Tickets
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Choose your preferred ticket type and quantity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={ticketType}
                  onValueChange={(value) => {
                    form.setValue("ticketType", value);
                    form.setValue("quantity", 1);
                  }}
                  className="grid gap-4"
                >
                  {ticketTypes.map((ticket) => {
                    const availableTickets = remainingTickets[ticket.name] || 0;
                    const maxAllowed = Math.min(5, availableTickets);

                    return (
                      <div key={ticket.name}>
                        <RadioGroupItem
                          value={ticket.name}
                          id={ticket.name}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={ticket.name}
                          className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-primary ${
                            ticketType === ticket.name
                              ? "border-primary bg-primary/5"
                              : ""
                          } ${
                            availableTickets === 0
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="rounded-md bg-primary/10 p-2">
                              <Ticket className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{ticket.name}</h3>
                              <p className="text-sm text-gray-500">
                                {availableTickets} tickets remaining
                                {availableTickets === 0 && (
                                  <span className="ml-2 text-red-500">
                                    (Sold out)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              ₹{ticket.price.toFixed(2)}
                            </p>
                          </div>
                        </Label>
                        {ticketType === ticket.name && availableTickets > 0 && (
                          <div className="mt-3 flex items-center justify-end gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (quantity > 1) {
                                    form.setValue("quantity", quantity - 1);
                                  }
                                }}
                                disabled={quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">
                                {quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (quantity < maxAllowed) {
                                    form.setValue("quantity", quantity + 1);
                                  } else {
                                    toast.warning(
                                      `You can book maximum ${maxAllowed} tickets for ${ticket.name}`,
                                    );
                                  }
                                }}
                                disabled={quantity >= maxAllowed}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-xs text-gray-500">
                      {quantity} ticket{quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-lg font-bold">₹{totalAmount.toFixed(2)}</p>
                </div>
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
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                  Contact Information
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  We'll send your tickets to these details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="bookingEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          className="h-12"
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  <p>
                    Your tickets will be sent via email and SMS to this number
                  </p>
                </div>
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
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                  Attendee Details
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Enter details for each attendee
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {attendees.map((_, index) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center font-semibold">
                        <User className="mr-2 h-5 w-5" /> Attendee {index + 1}
                      </h3>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newAttendees = [...attendees];
                            newAttendees.splice(index, 1);
                            form.setValue("attendees", newAttendees);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name={`attendees.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name (as per ID)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter full name"
                              {...field}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`attendees.${index}.age`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Age"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                value={field.value || ""}
                                className="h-12"
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
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                <SelectItem value="Prefer not to say">
                                  Prefer not to say
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`attendees.${index}.aadharNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhar Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter 12-digit Aadhar number"
                              maxLength={12}
                              {...field}
                              className="h-12"
                            />
                          </FormControl>
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
                    + Add Attendee ({attendees.length}/{quantity})
                  </Button>
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
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                  Order Summary
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Review your booking details before payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Ticket Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{ticketType}</p>
                        <p className="text-sm text-gray-500">
                          {quantity} ticket{quantity > 1 ? "s" : ""} × ₹
                          {selectedTicket?.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{((selectedTicket?.price || 0) * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <h3 className="font-medium">Attendees</h3>
                    {attendees.map((attendee, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            Attendee {index + 1}
                          </p>
                          <p className="text-sm text-gray-500">
                            {attendee.name}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {attendee.gender}, {attendee.age} yrs
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{bookingEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{bookingPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm">₹{totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Convenience Fee</p>
                    <p className="text-sm">₹0.00</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-bold">
                    <p>Total</p>
                    <p>₹{totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                  <p>
                    100% Secure Payment. Your tickets will be emailed to you
                    immediately after payment.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full py-6 text-lg font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${totalAmount.toFixed(2)}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full md:w-1/3">
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Progress</CardTitle>
                  <Progress value={(step / 4) * 100} className="h-2" />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {[
                      {
                        label: "Ticket Selection",
                        icon: <Ticket className="h-5 w-5" />,
                      },
                      {
                        label: "Contact Details",
                        icon: <Mail className="h-5 w-5" />,
                      },
                      {
                        label: "Attendee Details",
                        icon: <User className="h-5 w-5" />,
                      },
                      {
                        label: "Review & Pay",
                        icon: <CheckCircle className="h-5 w-5" />,
                      },
                    ].map((item, index) => {
                      const stepNum = index + 1;
                      const isCompleted = completedSteps.has(stepNum);
                      const isCurrent = step === stepNum;

                      return (
                        <li
                          key={stepNum}
                          className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                            isCurrent ? "bg-primary/10" : ""
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isCompleted
                                ? "bg-primary text-white"
                                : isCurrent
                                  ? "bg-primary/20 text-primary"
                                  : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              item.icon
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                isCurrent ? "text-primary" : "text-gray-700"
                              }`}
                            >
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isCompleted
                                ? "Completed"
                                : isCurrent
                                  ? "In progress"
                                  : "Pending"}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-4 border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {quantity} × {ticketType}
                    </p>
                    <p className="text-sm">
                      ₹
                      {selectedTicket
                        ? (selectedTicket.price * quantity).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-bold">
                    <p>Total</p>
                    <p>₹{totalAmount.toFixed(2)}</p>
                  </div>
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
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                {step < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="gap-2"
                  >
                    Next <ChevronRight className="h-4 w-4" />
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
