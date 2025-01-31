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
import { useState, useEffect } from "react";
import { generateImageDescription } from "@/app/actions/generate-image-description";

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

// Create an ImagePreview component that uses useFormStatus
function ImagePreview({ base64ImageData }: { base64ImageData: string | null }) {
  if (base64ImageData) {
    return (
      <div className="mt-2 p-4 border rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Your uploaded pie photo:
        </p>
        <div className="flex justify-center">
          <Image
            src={base64ImageData}
            alt="Your uploaded pie"
            height={300}
            width={300}
            className="object-cover rounded-md"
          />
        </div>
      </div>
    );
  }

  return (
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
  );
}

export function SubmitPieForm({ userName }: SubmitPieFormProps) {
  const { toast } = useToast();
  const [base64ImageData, setBase64ImageData] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "AI is analyzing your delicious pie...",
    "Detecting ingredients and style...",
    "Crafting a description of your masterpiece...",
    "Almost done describing your beautiful creation...",
  ];

  // Add an effect to rotate through messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGeneratingDescription) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000); // Change message every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isGeneratingDescription, loadingMessages.length]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsGeneratingDescription(true);
      // Compress the image first
      const compressedImageData = await compressImage(file);
      setBase64ImageData(compressedImageData);

      // Only generate description if feature flag is enabled
      if (process.env.NEXT_PUBLIC_ENABLE_AI_DESCRIPTION === "true") {
        const result = await generateImageDescription(compressedImageData);

        if (result.success) {
          const descriptionTextarea = document.querySelector(
            'textarea[name="description"]'
          ) as HTMLTextAreaElement;
          if (descriptionTextarea && result.description) {
            descriptionTextarea.value = result.description;
          }
        } else {
          toast({
            title: "Warning",
            description:
              "Could not generate image description. You can still write your own!",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  async function clientAction(formData: FormData) {
    if (!userName) return;

    try {
      // Use the base64ImageData state instead of trying to compress the file again
      if (!base64ImageData) {
        throw new Error("No image data available");
      }

      // Create new FormData with the already compressed image
      const submitFormData = new FormData();
      submitFormData.append("title", formData.get("title") as string);
      submitFormData.append(
        "description",
        formData.get("description") as string
      );
      submitFormData.append("userName", userName);
      submitFormData.append("imageData", base64ImageData);

      // Use submitFormData instead of formDataObject
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
          <div className="relative">
            <Label htmlFor="file-upload">
              Firstly, let&apos;s upload a photo of your pie
            </Label>
            <input
              id="file-upload"
              name="image"
              type="file"
              capture="environment"
              accept="image/*"
              className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              required
              title="Take a photo of your pie"
              onChange={handleImageChange}
            />
          </div>

          <ImagePreview base64ImageData={base64ImageData} />

          <div>
            <Input type="text" name="title" placeholder="Pie Title" required />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder={
                isGeneratingDescription
                  ? loadingMessages[loadingMessageIndex]
                  : "Share the story behind your pie! For example: 'This is my grandmother's classic apple pie recipe, made with fresh-picked apples from our local orchard. The lattice top took some practice but I'm really proud of how it turned out!' You can also include a link to your recipe: https://example.com/recipe"
              }
              rows={5}
              disabled={isGeneratingDescription}
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
