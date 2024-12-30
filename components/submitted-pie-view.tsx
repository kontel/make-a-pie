"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDelete } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import type { PieWithVotes } from "@/types/prisma";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SubmittedPieViewProps {
  userPie: PieWithVotes;
}

export function SubmittedPieView({ userPie }: SubmittedPieViewProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [deletePie] = useDelete(`/api/pies/${userPie.id}`);

  const handleResubmit = async () => {
    try {
      setIsResubmitting(true);
      await deletePie();
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