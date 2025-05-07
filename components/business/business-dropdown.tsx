// File: components/shops-dropdown-menu.tsx
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoAdd, IoChevronDownOutline } from "react-icons/io5";
import clsx from "clsx";
import * as v from "valibot";
import { Business } from "@/types";
import {
  BusinessFormInput,
  BusinessSchema,
} from "@/validators/business-validator";
import { createBusiness } from "@/actions/business-action";
import { toast } from "sonner";
import Image from "next/image";

interface ShopsDropdownMenuProps {
  businesses: Business[];
}

export default function ShopsDropdownMenu({
  businesses,
}: ShopsDropdownMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [step, setStep] = useState<"selectType" | "details">("selectType");
  const [shopName, setShopName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [businessType, setBusinessType] = useState<
    "restaurant" | "event" | null
  >(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!isDialogOpen) {
      setShopName("");
      setDescription("");
      setBusinessType(null);
      setStep("selectType");
      setErrors({});
    }
  }, [isDialogOpen]);

  const handleSaveEdit = async () => {
    if (!businessType) {
      setErrors({ businessType: "Business type is required" });
      return;
    }

    const data: BusinessFormInput = {
      name: shopName,
      description,
      businessType,
    };

    try {
      v.parse(BusinessSchema, data);
      setErrors({});
    } catch (error) {
      if (error instanceof v.ValiError) {
        const errorMap: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path?.[0]?.key || "unknown";
          errorMap[path] = issue.message;
        });
        setErrors(errorMap);
        return;
      }
      console.error("Validation error:", error);
      toast.error("Invalid input data");
      return;
    }

    startTransition(async () => {
      const result = await createBusiness(data);
      if (result.success && result.businessId) {
        toast.success("New business created!");
        setIsDialogOpen(false);
        router.push(`/business/${result.businessId}`);
      } else {
        toast.error(result.error || "Failed to create business");
      }
    });
  };

  const switchShop = (business: Business) => {
    setIsDialogOpen(false);
    router.push(`/business/${business.id}`);
  };

  const handleTypeSelection = (type: "restaurant" | "event") => {
    setBusinessType(type);
    setStep("details");
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
      }}
    >
      <div>
        {businesses.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="inline-flex items-center justify-center text-sm font-medium"
              >
                <span>My businesses</span>
                <IoChevronDownOutline
                  className={clsx(
                    "ml-2 h-4 w-4 shrink-0 transition-transform",
                    isDialogOpen && "rotate-180",
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col items-start px-2 py-1.5">
                <span className="text-xs text-gray-500">Now viewing</span>
                <span className="font-medium">
                  {businesses[0]?.name || "No business selected"}
                </span>
              </div>
              <DropdownMenuSeparator />
              {businesses.length > 1 &&
                businesses.slice(1).map((business) => (
                  <DropdownMenuItem
                    key={business.id}
                    onSelect={() => switchShop(business)}
                    className="cursor-pointer"
                  >
                    {business.name}
                  </DropdownMenuItem>
                ))}
              <DialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <IoAdd className="mr-2 h-3.5 w-3.5" />
                  Create new business
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DialogTrigger asChild>
            <Button className="flex items-center gap-x-1.5">
              <IoAdd className="h-4 w-4" />
              New Business
            </Button>
          </DialogTrigger>
        )}
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new business</DialogTitle>
          <DialogDescription>
            {step === "selectType"
              ? "Choose the type of business you want to create."
              : "Provide details for your new business."}
          </DialogDescription>
        </DialogHeader>
        {step === "selectType" ? (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div
              className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleTypeSelection("restaurant")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && handleTypeSelection("restaurant")
              }
            >
              <Image
                src="/rest.png"
                alt="Restaurant business type"
                width={100}
                height={100}
                className="mx-auto"
              />
              <h3 className="mt-2 text-center font-medium">Restaurant</h3>
            </div>
            <div
              className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleTypeSelection("event")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && handleTypeSelection("event")
              }
            >
              <Image
                src="/event.png"
                alt="Event company business type"
                width={100}
                height={100}
                className="mx-auto"
              />
              <h3 className="mt-2 text-center font-medium">Event Company</h3>
            </div>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div className="space-y-2">
              <label
                htmlFor="shopName"
                className="text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Business Name
              </label>
              <Input
                id="shopName"
                type="text"
                placeholder="Business name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Business description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                disabled={isPending}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            {errors.businessType && (
              <p className="text-sm text-red-600">{errors.businessType}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("selectType")}
                disabled={isPending}
              >
                Back
              </Button>
              <Button type="submit" disabled={isPending || !shopName}>
                {isPending ? "Creating..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
