"use client";

import { SiGithub } from "react-icons/si";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { oauthAction } from "@/actions/oauth-action";

const OAuthButtons = ({ signup }: { signup?: boolean }) => {
  const clickHandler = async (provider: "google" | "github") => {
    await oauthAction(provider);
  };

  const text = signup ? "Sign up" : "Sign in";

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        variant="outline"
        onClick={clickHandler.bind(null, "google")}
        className="w-full text-xs"
      >
        <FcGoogle />
        {text} with Google
      </Button>
      <Button
        variant="outline"
        onClick={clickHandler.bind(null, "github")}
        className="w-full text-xs"
      >
        <SiGithub />
        {text} with Github
      </Button>
    </div>
  );
};

export default OAuthButtons;
