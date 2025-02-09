"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PieWithVotes } from "@/types/prisma";
import { submitVote } from "@/app/actions/submit-vote";
import Image from "next/image";
import { getPieImage } from "@/app/actions/get-pie-image";

interface VoteClientProps {
  initialPies: Omit<PieWithVotes, "imageData">[];
}

export function VoteClient({ initialPies }: VoteClientProps) {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const router = useRouter();
  const [votedPies, setVotedPies] = useState<Set<string>>(new Set());
  const [remainingStars, setRemainingStars] = useState(3);
  const [pieImages, setPieImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (!userName) {
      router.push("/");
      return;
    }

    // Initialize voted pies and calculate remaining stars
    const voted = new Set(
      initialPies
        .filter((pie) => pie.votes.some((vote) => vote.userName === userName))
        .map((pie) => pie.id)
    );

    const usedStars = initialPies.reduce((acc, pie) => {
      const userVote = pie.votes.find((vote) => vote.userName === userName);
      return acc + (userVote?.stars || 0);
    }, 0);

    // Use functional updates to ensure state updates are based on previous state
    setVotedPies((prev: Set<string>) => {
      if (
        prev.size === voted.size &&
        Array.from(prev).every((id) => voted.has(id))
      ) {
        return prev;
      }
      return voted;
    });

    setRemainingStars((prev: number) => {
      const newStars = 3 - usedStars;
      return prev === newStars ? prev : newStars;
    });
  }, [userName, router, initialPies]);

  // Modified to use server action
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

  useEffect(() => {
    initialPies.forEach((pie) => {
      fetchPieImage(pie.id);
    });
  }, [initialPies]);

  if (!userName) {
    return null;
  }

  const handleVote = async (pieId: string, stars: number) => {
    if (stars > remainingStars) {
      alert(`You only have ${remainingStars} stars remaining!`);
      return;
    }
    const result = await submitVote(pieId, userName, stars);
    if (result.success) {
      setVotedPies(new Set([...votedPies, pieId]));
      setRemainingStars(remainingStars - stars);
      router.refresh();
    }
  };

  return (
    <>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <p className="text-lg font-semibold">
          Remaining Stars: {"⭐".repeat(remainingStars)}
          {remainingStars === 0 && " (All stars used!)"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialPies.map((pie) => (
          <Card key={pie.id}>
            <CardHeader>
              <CardTitle>{pie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full mb-4 rounded-xl overflow-hidden">
                {(!pieImages[pie.id] || loadingImages[pie.id]) && (
                  <div className="absolute inset-0 flex flex-col gap-2 p-4 bg-muted">
                    {/* Image placeholder */}
                    <div className="flex-1 bg-muted-foreground/10 rounded-lg animate-pulse" />
                    {/* Text line placeholders */}
                    <div className="h-4 w-3/4 bg-muted-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted-foreground/10 rounded animate-pulse" />
                  </div>
                )}
                {pieImages[pie.id] && (
                  <Image
                    src={pieImages[pie.id]}
                    alt={pie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              <p>Baker: {pie.userName}</p>
              {votedPies.has(pie.id) ? (
                <p className="text-muted-foreground">Already voted!</p>
              ) : (
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3]
                    .filter((stars) => stars <= remainingStars)
                    .map((stars) => (
                      <button
                        key={stars}
                        onClick={() => handleVote(pie.id, stars)}
                        className="p-2 border rounded hover:bg-muted"
                      >
                        {"⭐".repeat(stars)}
                      </button>
                    ))}
                  {remainingStars === 0 && (
                    <p className="text-muted-foreground">No stars remaining!</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
