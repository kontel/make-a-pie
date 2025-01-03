"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitPie } from "@/app/actions/submit-pie";
import type { PieWithVotes } from "@/types/prisma";

interface SubmitPieFormProps {
  userName: string;
  onPieSubmitted: (pie: PieWithVotes) => void;
}

// Create a submit button component to use formStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Pie"
      )}
    </Button>
  );
}

export function SubmitPieForm({
  userName,
  onPieSubmitted,
}: SubmitPieFormProps) {
  const { toast } = useToast();

  async function clientAction(formData: FormData) {
    if (!userName) return;

    formData.append("userName", userName);
    const result = await submitPie(formData);

    if (result.success) {
      toast({
        title: "Success!",
        description: "Your pie has been submitted successfully.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to submit your pie. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Pie</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
          <div>
            <Input type="text" name="title" placeholder="Pie Title" required />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Short description"
              rows={5}
            />
          </div>
          <div>
            <Input
              type="file"
              name="image"
              accept="image/*"
              capture="environment"
              required
            />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
