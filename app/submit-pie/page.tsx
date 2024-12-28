"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePost, useDelete } from "@/hooks/useApi";
import { useLocalStorage } from "usehooks-ts";
import { useGet } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import type { PieWithVotes } from "@/types/prisma";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PieSkeleton } from "@/components/ui/pie-skeleton";

export default function SubmitPie() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const { data: pies, isLoading } = useGet<PieWithVotes[]>("/api/pies");

  const hasSubmittedPie = pies?.some(
    (pie) => pie.userName.replaceAll('"', "") === userName.replaceAll('"', "")
  );

  const userPie = pies?.find(
    (pie) => pie.userName.replaceAll('"', "") === userName.replaceAll('"', "")
  );

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [createPie] = usePost("/api/pies");
  const [deletePie] = useDelete(`/api/pies/${userPie?.id}`);

  useEffect(() => {
    if (!userName) {
      router.push("/");
    }
  }, [router, userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) return;

    try {
      setIsSubmitting(true);
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
      toast({
        title: "Success!",
        description: "Your pie has been submitted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to submit pie:", error);
      toast({
        title: "Error",
        description: "Failed to submit your pie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = async () => {
    if (!userPie) return;
    
    try {
      setIsResubmitting(true);
      await deletePie(); // No body needed for DELETE request
      toast({
        title: "Pie deleted",
        description: "You can now submit a new pie.",
        variant: "default",
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete pie:", error);
      toast({
        title: "Error",
        description: "Failed to delete your pie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResubmitting(false);
    }
  };

  if (!userName) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PieSkeleton />
      </div>
    );
  }

  if (hasSubmittedPie && userPie) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg text-center text-lg font-medium shadow-sm border bg-orange-50 border-orange-200 text-orange-800">
          <p className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">🥧</span>
            You have already submitted a pie!
            <span className="text-2xl">🥧</span>
          </p>

          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <CardTitle>Your Submitted Pie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                <Image
                  src={userPie.imageData || ""}
                  alt={userPie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">{userPie.title}</h3>
                <p className="text-gray-600 text-sm">{userPie.description}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => router.push("/vote")}
                  className="flex-1"
                >
                  Go Vote For Pies
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      disabled={isResubmitting}
                    >
                      {isResubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resubmitting...
                        </>
                      ) : (
                        "Resubmit Pie"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete your current pie submission. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResubmit}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, delete and resubmit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Pie"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
