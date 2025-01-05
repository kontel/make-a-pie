"use client";

import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { name, localStorageUserName, handleLogin, reset, continueToApp } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center p-4 gap-6">
      <Image
        src="/welcome-pie.webp"
        alt="Delicious homemade pie"
        height={200}
        width={200}
        className="rounded-lg shadow-lg object-cover"
        priority
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg text-center font-medium m-b-4">
            🥧 Welcome to Make a Pie! 🥧
          </CardTitle>
          <CardDescription className="text-center pb-2 mt-4">
            🌟 Bake, Share, and Vote for Amazing Pies! 🌟
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!localStorageUserName ? (
            <LoginForm onSubmit={handleLogin} initialValue={name} />
          ) : (
            <div className="space-y-4">
              <div className=" bg-gray-50 rounded-lg text-center">
                <p className="text-md font-medium">Welcome back, {name}!</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={reset}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Reset Name
                </Button>
                <Button onClick={continueToApp} className="flex-1 h-12">
                  Continue
                </Button>
              </div>
            </div>
          )}
          <p className="mt-4 p-3 text-sm bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 font-medium">
            ⚠️ Important: You must use your real name. This system operates on
            trust and honesty.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
