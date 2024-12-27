"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGet } from "@/hooks/useApi";
import type { PieWithVotes, Vote } from "@/types/prisma";

export default function Leaderboard() {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const router = useRouter();
  const {
    data: pies,
    error: piesError,
    isLoading: piesLoading,
  } = useGet<PieWithVotes[]>("/api/pies");

  useEffect(() => {
    if (!userName) {
      router.push("/");
    }
  }, [router, userName]);

  if (!userName || piesLoading) {
    return null;
  }

  if (piesError) {
    return <div>Error: {piesError.message}</div>;
  }

  // Calculate statistics
  const calculateStats = (pies: PieWithVotes[]) => {
    const totalVotes = pies.reduce((acc, pie) => acc + pie.votes.length, 0);
    const totalStars = pies.reduce((acc, pie) => acc + pie.votes.reduce((sum, vote) => sum + vote.stars, 0), 0);
    const averageStars = totalStars / totalVotes || 0;
    
    // Find users who gave all stars to one pie
    const allStarsToOnePie = new Set(
      pies.flatMap(pie => 
        pie.votes
          .filter(vote => vote.stars === 5)
          .map(vote => vote.userName)
      )
    ).size;

    return {
      totalVotes,
      totalStars,
      averageStars: averageStars.toFixed(1),
      allStarsToOnePie,
      uniqueVoters: new Set(pies.flatMap(pie => pie.votes.map(v => v.userName))).size,
    };
  };

  const leaderboard = pies
    ? pies.map((pie: PieWithVotes) => ({
        id: pie.id,
        name: pie.userName,
        pieTitle: pie.title,
        stars: pie.votes.reduce(
          (total: number, vote: Vote) => total + vote.stars,
          0
        ),
      }))
    : [];

  const stats = pies ? calculateStats(pies) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">🗳️ {stats.totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">⭐ {stats.totalStars}</div>
              <div className="text-sm text-muted-foreground">Total Stars</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">📊 {stats.averageStars}</div>
              <div className="text-sm text-muted-foreground">Avg Stars/Vote</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">💝 {stats.allStarsToOnePie}</div>
              <div className="text-sm text-muted-foreground">Perfect Scores</div>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Pie Title</TableHead>
              <TableHead>Stars</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard
              .sort(
                (a: { stars: number }, b: { stars: number }) =>
                  b.stars - a.stars
              )
              .map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {index === 0
                      ? "🥇 1"
                      : index === 1
                      ? "🥈 2"
                      : index === 2
                      ? "🥉 3"
                      : index + 1}
                  </TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.pieTitle}</TableCell>
                  <TableCell>{entry.stars}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
