"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGet, usePost } from "@/hooks/useApi";
import type { PieWithVotes } from "@/types/prisma";
import { cn } from "@/lib/utils";

export default function Vote() {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const {
    data: pies,
    error: piesError,
    isLoading: piesLoading,
  } = useGet<PieWithVotes[]>("/api/pies");

  const remainingStars = 3 - Object.values(votes).reduce((a, b) => a + b, 0);

  // Initialize votes from database when data is loaded
  useEffect(() => {
    if (pies && userName) {
      console.log("pies", pies);
      console.log("userName", userName);

      const userVotes = pies.reduce((acc, pie) => {
        const userVotesCount = pie.votes.filter(
          (vote) => vote.userName === userName
        ).length;
        if (userVotesCount > 0) {
          acc[pie.id] = userVotesCount;
        }
        return acc;
      }, {} as { [key: string]: number });

      setVotes(userVotes);
    }
  }, [pies, userName]);

  const [createVote] = usePost("/api/votes");

  useEffect(() => {
    if (!userName) {
      router.push("/");
    }
  }, [router, userName]);

  const handleVote = async (pieId: string) => {
    if (!userName) return;

    const currentVotes = votes[pieId] || 0;
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    if (currentVotes < 3 && totalVotes < 3) {
      await createVote({
        stars: 1,
        userName: userName.replaceAll('"', ""),
        pieId,
      });
      setVotes((prevVotes) => ({
        ...prevVotes,
        [pieId]: (prevVotes[pieId] || 0) + 1,
      }));
    }
  };

  if (!userName || piesLoading) {
    return null;
  }

  if (piesError) {
    return <div>Error: {piesError.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vote for Pies</h1>
      <div
        className={cn(
          "p-4 rounded-lg text-center text-lg font-medium shadow-sm border",
          remainingStars === 0
            ? "bg-yellow-50 border-yellow-200 text-yellow-800"
            : "bg-blue-50 border-blue-200 text-blue-800"
        )}
      >
        {remainingStars === 0 ? (
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">⭐</span>
            {userName.replaceAll('"', "")} have used all your votes!
            <span className="text-2xl">⭐</span>
          </p>
        ) : (
          <p>
            {userName.replaceAll('"', "")} have{" "}
            <span className="text-3xl font-bold mx-2">{remainingStars}</span>
            {remainingStars === 1 ? "star" : "stars"} left to allocate
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pies &&
          pies.map((pie: PieWithVotes) => (
            <Card key={pie.id}>
              <CardHeader>
                <CardTitle>{pie.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={
                    pie.imageData ||
                    `https://placehold.co/400x300/cccccc/333333.png?text=${pie.title}`
                  }
                  alt={pie.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/400x300/cccccc/333333.png?text=${pie.title}`;
                  }}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full my-2">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>{pie.title}</DialogTitle>
                    <Image
                      src={
                        pie.imageData ||
                        `https://placehold.co/400x300/cccccc/333333.png?text=${pie.title}`
                      }
                      alt={pie.title}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover rounded-md"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/400x300/cccccc/333333.png?text=${pie.title}`;
                      }}
                    />
                    <p>{pie.description}</p>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleVote(pie.id)}
                  disabled={
                    votes[pie.id] === 3 ||
                    Object.values(votes).reduce((a, b) => a + b, 0) === 3
                  }
                  className="w-full mb-2"
                >
                  Vote ({votes[pie.id] || 0} stars)
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
