"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitPie } from "@/app/actions/submit-pie";
import { Label } from "./ui/label";
import { compressImage } from "@/app/utils/imageCompression";

interface SubmitPieFormProps {
  userName: string;
}

// Create a submit button component to use formStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full h-12" disabled={pending}>
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

export function SubmitPieForm({ userName }: SubmitPieFormProps) {
  const { toast } = useToast();

  async function clientAction(formData: FormData) {
    if (!userName) return;

    try {
      // Get the image file
      const imageFile = formData.get("image") as File;

      // Compress the image
      const compressedImageData = await compressImage(imageFile);

      // Create new FormData with compressed image
      const submitFormData = new FormData();
      submitFormData.append("title", formData.get("title") as string);
      submitFormData.append(
        "description",
        formData.get("description") as string
      );
      submitFormData.append("userName", userName);
      submitFormData.append("imageData", compressedImageData);

      const result = await submitPie(submitFormData);

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
    } catch (error) {
      console.error("Error submitting pie:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Submit Your Pie</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <form action={clientAction} className="space-y-4 w-full">
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
          <div className="relative">
            <Label htmlFor="file-upload">Make or upload your pie photo</Label>
            <Input
              type="file"
              name="image"
              accept="image/*"
              capture="environment"
              required
              title="Take a photo of your pie"
            />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
      <div className="mt-2 p-4 border rounded-lg">
        <h5 className="text-sm font-semibold mb-3">
          How to make a good pie photo
        </h5>
        <div className="flex justify-center">
          <Image
            src="/how-to-photo.webp"
            alt="How to make a good pie photo"
            height={300}
            width={300}
            className="rounded-lg shadow-lg object-cover"
            priority
          />
        </div>
      </div>
    </Card>
  );
}
