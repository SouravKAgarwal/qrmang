"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";

const RedirectPasswordForm = ({
  shortUrl,
  requiresPassword,
}: {
  shortUrl: string;
  requiresPassword: boolean;
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/qr/${shortUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok && data.redirectUrl) {
      router.replace(data.redirectUrl);
    } else {
      setError(data.error || "Incorrect password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {requiresPassword && (
        <Card>
          <CardContent>
            <CardHeader className="text-xl font-semibold">
              Enter Password
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Label>Enter the password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit">Submit</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RedirectPasswordForm;
