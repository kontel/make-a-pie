"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePost } from "@/hooks/useApi";
import { useLocalStorage } from "usehooks-ts";
import { useGet } from "@/hooks/useApi";
import type { PieWithVotes } from "@/types/prisma";

export default function SubmitPie() {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const { data: pies, isLoading } = useGet<PieWithVotes[]>("/api/pies");

  const hasSubmittedPie = pies?.some(
    (pie) => pie.userName.replaceAll('"', "") === userName.replaceAll('"', "")
  );

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [createPie] = usePost("/api/pies");

  useEffect(() => {
    if (!userName) {
      router.push("/");
    }
  }, [router, userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) return;

    try {
      if (!image) return;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      await new Promise((resolve) => {
        reader.onload = () => {
          const imageData = reader.result as string;
          createPie({
            title,
            description,
            imageData,
            userName: userName.replaceAll('"', ""),
          });
          resolve(null);
        };
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit pie:", error);
    }
  };

  if (!userName) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (hasSubmittedPie) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg text-center text-lg font-medium shadow-sm border bg-orange-50 border-orange-200 text-orange-800">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🥧</span>
            You have already submitted a pie! You can only submit one pie per
            competition.
            <span className="text-2xl">🥧</span>
          </p>
          <div className="mt-4">
            <Button 
              onClick={() => router.push("/dashboard")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Go Vote For Pies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Pie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Pie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Short description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Pie
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
