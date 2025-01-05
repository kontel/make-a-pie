import { prisma } from "@/lib/prisma";
import type { PieWithVotes } from "@/types/prisma";
import { LeaderboardClient } from "./leaderboard-client";
import { unstable_cache as cache, unstable_cache } from "next/cache"; // Import the cache from Next.js

export default async function Leaderboard() {

  const getCachedPiesWithVotes = unstable_cache(
    async () => {
      return await prisma.pie.findMany({
        include: {
          votes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
    ["pieWithVotesCacheKey"],
    { revalidate: 60, tags: ["pieWithVotesCacheKey"] }
  );

  const pies = await getCachedPiesWithVotes();

  return <LeaderboardClient initialPies={pies} />;
}

export const dynamic = "force-dynamic";
