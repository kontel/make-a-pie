"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePost } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SubmitPieFormProps {
  userName: string;
}

export function SubmitPieForm({ userName }: SubmitPieFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [createPie] = usePost("/api/pies");

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
      window.location.reload();
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
