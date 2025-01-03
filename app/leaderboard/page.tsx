import { prisma } from "@/lib/prisma";
import type { PieWithVotes } from "@/types/prisma";
import { LeaderboardClient } from "./leaderboard-client";

export default async function Leaderboard() {
  const pies: PieWithVotes[] = await prisma.pie.findMany({
    include: {
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <LeaderboardClient initialPies={pies} />;
}

export const dynamic = "force-dynamic";
