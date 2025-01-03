import { prisma } from "@/lib/prisma";
import { VoteClient } from "./vote-client";
import type { PieWithVotes } from "@/types/prisma";

export default async function Vote() {
  const pies: PieWithVotes[] = await prisma.pie.findMany({
    include: {
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <VoteClient initialPies={pies} />;
}

export const dynamic = "force-dynamic";
