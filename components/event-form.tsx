"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarDays,
  Image as ImageIcon,
  Upload,
  Trash2,
  User as UserIcon,
  Plus,
  View,
} from "lucide-react";
import { safeParse } from "valibot";
import { eventSchema } from "@/validators/event-validator";
import { createEvent, draftEvent } from "@/actions/event-actions";
import { type User } from "next-auth";
import { useRouter } from "next/navigation";
import EventPamphlet from "./pamphlet-template";
import { type TicketType } from "@/types";
import { uploadImageUrl } from "@/lib";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateEvent({
  eventId,
  user,
}: {
  eventId: string;
  user: User;
}) {
  const [pamphletUrl, setPamphletUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    id: eventId,
    userId: user?.id || "",
    title: "",
    description: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    category: "",
    eventType: "",
    ticketTypes: [{ name: "", price: 0, seatsAvailable: 0, seatsRemaining: 0 }],
    eventImageUrl: "",
    eventStart: "",
    eventEnd: "",
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
    pamphletUrl: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showPamphlet, setShowPamphlet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(7).fill(false),
  );

  const eventImageInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const steps = [
    { name: "Basic Info", icon: <UserIcon className="h-5 w-5" /> },
    { name: "Date & Time", icon: <CalendarDays className="h-5 w-5" /> },
    { name: "Organizer", icon: <UserIcon className="h-5 w-5" /> },
    { name: "Location", icon: <UserIcon className="h-5 w-5" /> },
    { name: "Tickets", icon: <UserIcon className="h-5 w-5" /> },
    { name: "Media", icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Preview and Submit", icon: <View className="h-5 w-5" /> },
  ];

  const combineDateAndTime = (date: Date | null, time: string): string => {
    if (!date) return "";
    const newDate = new Date(date);
    const [hours, minutes] = time.split(":");
    if (hours && minutes) {
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }
    return newDate.toISOString();
  };

  const getTimeFromISOString = (isoString: string): string => {
    if (!isoString) return "00:00";
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleDateTimeChange = (
    field: "eventStart" | "eventEnd",
    date: Date | null,
    time: string,
  ) => {
    const isoString = combineDateAndTime(date, time);
    setFormData((prev) => ({ ...prev, [field]: isoString }));
    validateField(field, isoString);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketType,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const newTicketTypes = [...prev.ticketTypes];
      newTicketTypes[index] = {
        ...newTicketTypes[index],
        [field]: value,
        ...(field === "seatsAvailable" && { seatsRemaining: value as number }),
      };
      return { ...prev, ticketTypes: newTicketTypes };
    });
    validateField(`ticketTypes[${index}].${field}`, value);
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { name: "", price: 0, seatsAvailable: 0, seatsRemaining: 0 },
      ],
    }));
    toast({
      title: "Ticket Type Added",
      description: "New ticket type has been added.",
    });
  };

  const removeTicketType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
    toast({
      title: "Ticket Type Removed",
      description: "Ticket type has been removed.",
    });
  };

  const handleEventImageUpload = (
    event: React.ChangeEvent<HTMLInputElement> | File,
  ) => {
    const file = event instanceof File ? event : event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange("eventImageUrl", e.target?.result as string);
        toast({
          title: "Image Uploaded",
          description: "Event image has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventImageDelete = () => {
    setFormData((prev) => ({ ...prev, eventImageUrl: "" }));
    toast({
      title: "Image Removed",
      description: "Event image has been removed.",
    });
  };

  const validateField = (field: string, value: any) => {
    const result = safeParse(eventSchema, { ...formData, [field]: value });
    if (!result.success) {
      const fieldError = result.issues.find((issue) =>
        issue.path?.some((p) => p.key === field.split(".").pop()),
      );
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError?.message || "",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const fieldsToValidate: Record<number, string[]> = {
      0: ["title", "description", "category", "eventType"],
      1: ["eventStart", "eventEnd"],
      2: ["organizerName", "organizerEmail", "organizerPhone"],
      3: ["venue", "address", "city", "state", "country", "zipCode"],
      4: ["ticketTypes"],
      5: ["eventImageUrl"],
    };

    const result = safeParse(eventSchema, formData);
    if (!result.success) {
      const stepErrors = result.issues.filter((issue) =>
        issue.path?.some((p) =>
          fieldsToValidate[step].includes(p.key as string),
        ),
      );
      if (stepErrors.length > 0) {
        const newErrors: Record<string, string> = {};
        stepErrors.forEach((error) => {
          const field = error.path?.map((p) => p.key).join(".") || "";
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please correct the errors in this step.",
          variant: "destructive",
        });
        return false;
      }
    }
    setErrors({});
    setCompletedSteps((prev) => {
      const newSteps = [...prev];
      newSteps[step] = true;
      return newSteps;
    });
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowPamphlet(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = safeParse(eventSchema, formData);
    if (!result.success) {
      const errors = result.issues.map((issue) => issue.message).join("\n");
      toast({
        title: "Validation Error",
        description: errors,
        variant: "destructive",
      });
      return;
    }

    const eventImageUrl = await uploadImageUrl(formData.eventImageUrl);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "ticketTypes") {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value as any);
      }
    });
    formDataToSend.append("eventImageUrl", eventImageUrl);
    formDataToSend.append("pamphletUrl", pamphletUrl);

    try {
      const res = await draftEvent(formDataToSend);
      if (res.success) {
        toast({
          title: "Event saved as draft",
          description: "Your event has been saved as draft!",
        });
        router.push(`/dashboard/organiser/events`);
      } else {
        if (res.error && typeof res.error === "object") {
          const nestedErrors = Object.entries(res.error)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
          toast({
            title: "Error while drafting the event",
            description: nestedErrors,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error while drafting the event",
            description: res.error || "An unknown error occurred.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error drafting event:", error);
      toast({
        title: "Error",
        description: "Failed to draft event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = safeParse(eventSchema, formData);
    if (!result.success) {
      const errors = result.issues.map((issue) => issue.message).join("\n");
      toast({
        title: "Validation Error",
        description: errors,
        variant: "destructive",
      });
      return;
    }

    const eventImageUrl = await uploadImageUrl(formData.eventImageUrl);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "ticketTypes") {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value as any);
      }
    });
    formDataToSend.append("eventImageUrl", eventImageUrl);
    formDataToSend.append("pamphletUrl", pamphletUrl);

    try {
      const res = await createEvent(formDataToSend);
      if (res.success) {
        toast({
          title: "Event Created",
          description: "Your event has been successfully published!",
        });
        router.push(`/events/${res.data.id}`);
      } else {
        if (res.error && typeof res.error === "object") {
          const nestedErrors = Object.entries(res.error)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
          toast({
            title: "Error while creating the event",
            description: nestedErrors,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error while creating the event",
            description: res.error || "An unknown error occurred.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-indigo-500", "-50");
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-indigo-500", "-50");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-indigo-500", "-50");
    }
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleEventImageUpload(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = (step: number) => {
    return (
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl"> {steps[step].name}</CardTitle>
            <CardDescription className="">
              {getStepDescription(step)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter the name of your event"
                    required
                    className={cn(errors.title ? "border-red-500" : "")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your event"
                    rows={5}
                    className={cn(errors.description ? "border-red-500" : "")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(errors.category ? "border-red-500" : "")}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value) =>
                        handleInputChange("eventType", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(errors.eventType ? "border-red-500" : "")}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="concert">Concert</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.eventType && (
                      <p className="text-sm text-red-500">{errors.eventType}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal backdrop-blur-sm",
                          errors.eventStart && "border-red-500",
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {formData.eventStart ? (
                          format(new Date(formData.eventStart), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.eventStart
                            ? new Date(formData.eventStart)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateTimeChange(
                            "eventStart",
                            date || null,
                            getTimeFromISOString(formData.eventStart),
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="mt-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={getTimeFromISOString(formData.eventStart)}
                      onChange={(e) =>
                        handleDateTimeChange(
                          "eventStart",
                          formData.eventStart
                            ? new Date(formData.eventStart)
                            : null,
                          e.target.value,
                        )
                      }
                      required
                      className={cn(errors.eventStart ? "border-red-500" : "")}
                    />
                  </div>
                  {errors.eventStart && (
                    <p className="text-sm text-red-500">{errors.eventStart}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal backdrop-blur-sm",
                          errors.eventEnd && "border-red-500",
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {formData.eventEnd ? (
                          format(new Date(formData.eventEnd), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.eventEnd
                            ? new Date(formData.eventEnd)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateTimeChange(
                            "eventEnd",
                            date || null,
                            getTimeFromISOString(formData.eventEnd),
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="mt-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={getTimeFromISOString(formData.eventEnd)}
                      onChange={(e) =>
                        handleDateTimeChange(
                          "eventEnd",
                          formData.eventEnd
                            ? new Date(formData.eventEnd)
                            : null,
                          e.target.value,
                        )
                      }
                      required
                      className={cn(errors.eventEnd ? "border-red-500" : "")}
                    />
                  </div>
                  {errors.eventEnd && (
                    <p className="text-sm text-red-500">{errors.eventEnd}</p>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Organizer Name</Label>
                  <Input
                    value={formData.organizerName}
                    onChange={(e) =>
                      handleInputChange("organizerName", e.target.value)
                    }
                    placeholder="Enter organizer name"
                    required
                    className={cn(errors.organizerName ? "border-red-500" : "")}
                  />
                  {errors.organizerName && (
                    <p className="text-sm text-red-500">
                      {errors.organizerName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Organizer Email</Label>
                  <Input
                    type="email"
                    value={formData.organizerEmail}
                    onChange={(e) =>
                      handleInputChange("organizerEmail", e.target.value)
                    }
                    placeholder="Enter contact email"
                    required
                    className={cn(
                      errors.organizerEmail ? "border-red-500" : "",
                    )}
                  />
                  {errors.organizerEmail && (
                    <p className="text-sm text-red-500">
                      {errors.organizerEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    type="tel"
                    value={formData.organizerPhone}
                    onChange={(e) =>
                      handleInputChange("organizerPhone", e.target.value)
                    }
                    placeholder="Enter contact phone"
                    required
                    className={cn(
                      errors.organizerPhone ? "border-red-500" : "",
                    )}
                  />
                  {errors.organizerPhone && (
                    <p className="text-sm text-red-500">
                      {errors.organizerPhone}
                    </p>
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Venue Name</Label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="Enter venue name"
                    required
                    className={cn(errors.venue ? "border-red-500" : "")}
                  />
                  {errors.venue && (
                    <p className="text-sm text-red-500">{errors.venue}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Street address"
                    required
                    className={cn(errors.address ? "border-red-500" : "")}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="City"
                      required
                      className={cn(errors.city ? "border-red-500" : "")}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="State"
                      required
                      className={cn(errors.state ? "border-red-500" : "")}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="Country"
                      required
                      className={cn(errors.country ? "border-red-500" : "")}
                    />
                    {errors.country && (
                      <p className="text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      placeholder="Pincode"
                      required
                      className={cn(errors.zipCode ? "border-red-500" : "")}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                {formData.ticketTypes.map((ticket, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 gap-4 rounded-lg border-b p-4 pb-4 shadow-sm last:border-b-0 md:grid-cols-4"
                  >
                    <div className="space-y-2">
                      <Label>Ticket Name</Label>
                      <Input
                        value={ticket.name}
                        onChange={(e) =>
                          handleTicketTypeChange(index, "name", e.target.value)
                        }
                        placeholder="e.g., Silver"
                        required
                        className={cn(
                          errors[`ticketTypes[${index}].name`]
                            ? "border-red-500"
                            : "",
                        )}
                      />
                      {errors[`ticketTypes[${index}].name`] && (
                        <p className="text-sm text-red-500">
                          {errors[`ticketTypes[${index}].name`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "price",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                        min="0"
                        required
                        className={cn(
                          errors[`ticketTypes[${index}].price`]
                            ? "border-red-500"
                            : "",
                        )}
                      />
                      {errors[`ticketTypes[${index}].price`] && (
                        <p className="text-sm text-red-500">
                          {errors[`ticketTypes[${index}].price`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Seats Available</Label>
                      <Input
                        type="number"
                        value={ticket.seatsAvailable}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "seatsAvailable",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        placeholder="100"
                        min="1"
                        required
                        className={cn(
                          errors[`ticketTypes[${index}].seatsAvailable`]
                            ? "border-red-500"
                            : "",
                        )}
                      />
                      {errors[`ticketTypes[${index}].seatsAvailable`] && (
                        <p className="text-sm text-red-500">
                          {errors[`ticketTypes[${index}].seatsAvailable`]}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeTicketType(index)}
                              disabled={formData.ticketTypes.length === 1}
                              className="bg-red-500 text-white transition-all duration-300 hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove Ticket Type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>
                ))}
                <Button type="button" variant="outline" onClick={addTicketType}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ticket Type
                </Button>
              </>
            )}
            {step === 5 &&
              (formData.eventImageUrl ? (
                <div className="group relative">
                  <motion.img
                    src={formData.eventImageUrl}
                    alt="Event preview"
                    className="h-auto w-full rounded-lg object-cover shadow-md"
                    style={{ aspectRatio: "16/9", maxHeight: "300px" }}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          onClick={handleEventImageDelete}
                        >
                          <Trash2 />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove Image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="hover:-50 rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300"
                >
                  <motion.div
                    className="mx-auto mb-4 h-12 w-12"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ImageIcon className="-400 h-12 w-12" />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="-600 text-sm font-medium">
                      Drag and drop your images here
                    </p>
                    <p className="-400 text-sm">or click to browse</p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 bg-white/90 text-black backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                    type="button"
                    onClick={() => eventImageInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Event Image
                  </Button>
                  <input
                    ref={eventImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEventImageUpload}
                  />
                  {errors.eventImageUrl && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.eventImageUrl}
                    </p>
                  )}
                </div>
              ))}
            {step === 6 && (
              <EventPamphlet
                formData={formData}
                onBack={() => setCurrentStep(currentStep - 1)}
                onPublish={handlePublish}
                onDraft={handleDraft}
                setPamphletUrl={setPamphletUrl}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 0:
        return "Set the stage with your event's core details.";
      case 1:
        return "Choose when your event will take place.";
      case 2:
        return "Tell us who's behind this awesome event.";
      case 3:
        return "Pinpoint where the magic will happen.";
      case 4:
        return "Create ticket options for your attendees.";
      case 5:
        return "Add a stunning visual to attract your audience.";
      case 6:
        return "Review your event pamphlet before publishing.";
      default:
        return "";
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container mx-auto w-full max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl font-extrabold sm:text-4xl">
          Create Your Next Big Event
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{steps[currentStep].name}</p>
              <p className="text-sm">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-sidebar-foreground">
              <motion.div
                className="h-2 rounded-full bg-sidebar/80"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleNext} className="w-full space-y-6">
              <AnimatePresence mode="wait">
                {renderStepContent(currentStep)}
              </AnimatePresence>
              {currentStep !== 6 && (
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
