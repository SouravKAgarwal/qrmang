"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type UpdateUserInfoInput,
  UpdateUserInfoSchema,
} from "@/validators/update-user-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { updateUserAction } from "@/actions/update-user-action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { X, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { type User } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { signOut } from "next-auth/react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function ProfileForm({ user }: { user: User }) {
  const [success, setSuccess] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.image || null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, update } = useSession();
  const router = useRouter();

  const form = useForm<UpdateUserInfoInput>({
    resolver: valibotResolver(UpdateUserInfoSchema),
    defaultValues: {
      id: user?.id || "",
      name: user?.name || "",
      image: user?.image || "",
    },
  });

  const { setError, handleSubmit, control, formState, setValue } = form;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: UpdateUserInfoInput) => {
    try {
      const res = await updateUserAction(values);

      if (res.success) {
        const updatedUser = res.data;

        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            image: updatedUser.image,
          },
        });

        router.refresh();
        setSuccess("Profile updated successfully!");
      } else {
        switch (res.statusCode) {
          case 400:
            const nestedErrors = res.error.nested;
            for (const key in nestedErrors) {
              setError(key as keyof UpdateUserInfoInput, {
                message: nestedErrors[key]?.[0],
              });
            }
            break;
          case 401:
          case 500:
          default:
            const error = res.error || "Internal Server Error";
            setUploadError(error);
            break;
        }
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      setUploadError("An unexpected error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Failed to sign out:", error);
      setUploadError("Failed to sign out");
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-4">
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-sm dark:border-green-700 dark:bg-green-900/30"
          >
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {success}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSuccess("")}
              className="text-green-600 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-800/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 shadow-sm dark:border-red-700 dark:bg-red-900/30"
          >
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              {uploadError}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUploadError("")}
              className="text-red-600 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-800/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Personal Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        {imagePreview ? (
                          <motion.div
                            className="h-24 w-24 overflow-hidden rounded-full shadow-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={imagePreview}
                              alt={session?.user?.name || "Profile Image"}
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          </motion.div>
                        ) : (
                          <Avatar className="h-24 w-24">
                            <AvatarFallback>
                              <span className="text-3xl">
                                {user?.name?.charAt(0).toUpperCase()}
                              </span>
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={triggerFileInput}
                          >
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </Button>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            ref={fileInputRef}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Max size: 5MB. JPG, PNG, or GIF.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your name will appear on your profile and in
                      communications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input readOnly value={user?.email || ""} />
                <FormDescription>Your email cannot be changed.</FormDescription>
              </div>

              <FormField
                control={control}
                name="id"
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Account Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
            <CardDescription className="mt-2">
              Sign out of your account.
            </CardDescription>
          </div>
          <div>
            <Button
              variant="destructive"
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete Account
            </Button>
            <CardDescription className="mt-2">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
