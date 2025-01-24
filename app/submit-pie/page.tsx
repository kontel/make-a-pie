import { unstable_cache } from "next/cache";
import { SubmitPieClient } from "./submit-pie-client";
import { prisma } from "@/lib/prisma";

export default async function SubmitPie() {
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

  return <SubmitPieClient initialPies={pies} />;
}

export const dynamic = "force-dynamic";
