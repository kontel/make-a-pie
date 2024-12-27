"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocalStorage } from "usehooks-ts";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  // Set { initializeWithValue: false } in SSR context
  const [localStorageUserName, setLocalStorageUserName] = useLocalStorage(
    "userName",
    "",
    {
      initializeWithValue: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setLocalStorageUserName(name.trim());
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (localStorageUserName) {
      setName(localStorageUserName);
    }
  }, []);

  const handleReset = () => {
    setLocalStorageUserName("");
    setName("");
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Make a Pie!</CardTitle>
          {name ? (
            <CardDescription>Welcome back, {name}!</CardDescription>
          ) : (
            <CardDescription>Enter your name to get started</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!localStorageUserName ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Enter
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-lg font-medium">
                  Logged in as: {localStorageUserName}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Reset Name
                </Button>
                <Button onClick={handleContinue} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Note: This is a trust-based application. Please use your real name.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
