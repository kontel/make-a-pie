"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import type { PieWithVotes } from "@/types/prisma";
import { SubmitPieForm } from "@/components/submit-pie-form";
import { SubmittedPieView } from "@/components/submitted-pie-view";
import { getPieImage } from "@/app/actions/get-pie-image";

interface SubmitPieClientProps {
  initialPies: Omit<PieWithVotes, "imageData">[];
}

export function SubmitPieClient({ initialPies }: SubmitPieClientProps) {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const router = useRouter();
  const [pieImages, setPieImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );

  const fetchPieImage = async (pieId: string) => {
    try {
      setLoadingImages((prev) => ({
        ...prev,
        [pieId]: true,
      }));
      const imageData = await getPieImage(pieId);
      if (imageData) {
        setPieImages((prev) => ({
          ...prev,
          [pieId]: imageData,
        }));
      }
    } catch (error) {
      console.error(`Failed to load image for pie ${pieId}:`, error);
    } finally {
      setLoadingImages((prev) => ({
        ...prev,
        [pieId]: false,
      }));
    }
  };

  const userPie = initialPies?.find(
    (pie) => pie.userName.replaceAll('"', "") === userName.replaceAll('"', "")
  );

  useEffect(() => {
    if (!userName) {
      router.push("/");
    }
  }, [router, userName]);

  // Load the image when we find the user's pie
  useEffect(() => {
    if (userPie && !pieImages[userPie.id]) {
      fetchPieImage(userPie.id);
    }
  }, [pieImages, userPie]);

  if (!userName) {
    return null;
  }

  if (userPie) {
    return (
      <SubmittedPieView
        userPie={{
          ...userPie,
          imageData: pieImages[userPie.id] || null,
        }}
        isLoading={loadingImages[userPie.id]}
      />
    );
  }

  return <SubmitPieForm userName={userName} />;
}
