"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PieWithVotes } from "@/types/prisma";
import { submitVote } from "@/app/actions/submit-vote";
import Image from "next/image";

interface VoteClientProps {
  initialPies: PieWithVotes[];
}

export function VoteClient({ initialPies }: VoteClientProps) {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const router = useRouter();
  const [votedPies, setVotedPies] = useState<Set<string>>(new Set());
  const [remainingStars, setRemainingStars] = useState(3);

  useEffect(() => {
    if (!userName) {
      router.push("/");
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
    setRemainingStars(3 - usedStars);
    setVotedPies(voted);
  }, [userName, router, initialPies]);

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
              {pie.imageData && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={pie.imageData}
                    alt={pie.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
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
