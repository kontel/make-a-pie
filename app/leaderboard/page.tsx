"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const {
    data: pies,
    error: piesError,
    isLoading: piesLoading,
  } = useGet<PieWithVotes[]>("/api/pies");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (!storedName) {
      router.push("/");
    } else {
      setUserName(storedName);
    }
  }, [router]);

  if (!userName || piesLoading) {
    return null;
  }

  if (piesError) {
    return <div>Error: {piesError.message}</div>;
  }

  /**
   * Transforms an array of pie data into leaderboard entries.
   * @param {Pie[]} pies - Array of pie objects containing user submissions
   * @returns {Array<{
   *   id: string,
   *   name: string,
   *   pieTitle: string,
   *   stars: number
   * }>} Array of leaderboard entries with calculated total stars
   */
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <TableCell>{index + 1}</TableCell>
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
