"use client";

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
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Welcome to Make a Pie! 🥧
          </CardTitle>
          <div className="space-y-2">
            <CardDescription className="text-center pb-2 mt-4">
              🌟 Bake, Share, and Vote for Amazing Pies! 🌟
            </CardDescription>
            <p className="text-sm text-muted-foreground text-center">
              Join our delicious community where you can showcase your baking
              skills, discover mouthwatering pie recipes, and vote for your
              favorites! Each person gets 3 stars ⭐⭐⭐ to award to the best
              pies.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!localStorageUserName ? (
            <LoginForm onSubmit={handleLogin} initialValue={name} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-md font-medium">Welcome back, {name}!</p>
              </div>
              <div className="flex gap-4">
                <Button onClick={reset} variant="outline" className="flex-1">
                  Reset Name
                </Button>
                <Button onClick={continueToApp} className="flex-1">
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
