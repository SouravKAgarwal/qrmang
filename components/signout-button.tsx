"use client";

import { signoutUserAction } from "@/actions/signout-user-action";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export const Signout = () => {
  const clickHandler = async () => {
    await signoutUserAction();
    window.location.href = "/";
  };

  return (
    <Button variant="destructive" className="rounded-full" size="lg" onClick={clickHandler}>
      <LogOut />
      <span className="text-sm font-medium">Sign Out</span>
    </Button>
  );
};
