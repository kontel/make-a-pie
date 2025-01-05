import { prisma } from "@/lib/prisma";
import { LeaderboardClient } from "./leaderboard-client";
import { unstable_cache } from "next/cache"; 

export default async function Leaderboard() {

  const getCachedPiesWithVotes = unstable_cache(
    async () => {
      return await prisma.pie.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          userName: true,
          createdAt: true,
          updatedAt: true,
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
