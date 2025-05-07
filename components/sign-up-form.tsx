"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type SignupInput, SignupSchema } from "@/validators/signup-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupUserAction } from "@/actions/signup-user-actions";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

const SignupForm = () => {
  const form = useForm<SignupInput>({
    resolver: valibotResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const { handleSubmit, control, formState, reset, setError } = form;

  const submit = async (values: SignupInput) => {
    const res = await signupUserAction(values);

    if (res.success) {
      toast({
        title: "Sign up successfully",
        description: "Please sign in to continue",
        variant: "success",
      });
      reset();
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;

          for (const key in nestedErrors) {
            setError(key as keyof SignupInput, {
              message: nestedErrors[key]?.[0],
            });
            toast({
              title: "Sign Up Error",
              description: nestedErrors[key]?.[0],
              variant: "destructive",
            });
          }
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("confirmPassword", { message: error });
          toast({
            title: "Sign Up Error",
            description: res.error,
            variant: "destructive",
          });
          break;
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col gap-4">
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="m@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="e.g. ********"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="e.g. ********"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full"
          >
            Register
          </Button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
