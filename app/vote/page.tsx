"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import type { PieWithVotes } from '@/types/prisma';

export default function Vote() {
  const [userName, setUserName] = useState<string | null>(null);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const {
    data: pies,
    error: piesError,
    isLoading: piesLoading,
  } = useGet<PieWithVotes[]>('/api/pies');
  const [createVote] = usePost("/api/votes");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (!storedName) {
      router.push("/");
    } else {
      setUserName(storedName);
    }
  }, [router]);

  const handleVote = async (pieId: string) => {
    if (!userName) return;

    setVotes((prevVotes) => {
      const currentVotes = prevVotes[pieId] || 0;
      const totalVotes = Object.values(prevVotes).reduce((a, b) => a + b, 0);

      if (currentVotes < 3 && totalVotes < 3) {
        const newVotes = { ...prevVotes, [pieId]: currentVotes + 1 };
        createVote({ stars: 1, userName, pieId });
        return newVotes;
      }
      return prevVotes;
    });
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
      <p>
        You have {3 - Object.values(votes).reduce((a, b) => a + b, 0)} stars
        left to allocate.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pies &&
          pies.map((pie: PieWithVotes) => (
            <Card key={pie.id}>
              <CardHeader>
                <CardTitle>{pie.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={pie.imageData}
                  alt={pie.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e: unknown) => {
                    // @ts-expect-error default image
                    e.target.src = `https://placehold.co/400x300/cccccc/333333?text=${pie.title}`
                  }}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>{pie.title}</DialogTitle>
                    <Image
                      src={pie.imageData}
                      alt={pie.title}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover rounded-md"
                      onError={(e: unknown) => {
                        // @ts-expect-error default image
                        e.target.src = `https://placehold.co/400x300/cccccc/333333?text=${pie.title}`;
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
                  className="w-full"
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
