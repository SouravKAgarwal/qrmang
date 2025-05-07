"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type SigninInput, SigninSchema } from "@/validators/signin-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

import { signinUserAction } from "@/actions/signin-user-action";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

const SigninForm = () => {
  const form = useForm<SigninInput>({
    resolver: valibotResolver(SigninSchema),
    defaultValues: { email: "", password: "" },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: SigninInput) => {
    const res = await signinUserAction(values);

    if (res.success) {
      toast({
        title: "Sign in successfully",
        variant: "success",
      });
      window.location.reload();
    } else {
      switch (res.statusCode) {
        case 401:
          setError("password", { message: res.error });
          toast({
            title: "Sign In Error",
            description: res.error,
            variant: "destructive",
          });
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("password", { message: error });
          toast({
            title: "Sign In Error",
            description: res.error,
            variant: "destructive",
          });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col gap-6">
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
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full"
          >
            Login
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SigninForm;
