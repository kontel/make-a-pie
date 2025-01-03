import type { PieWithVotes } from "@/types/prisma";
import { SubmitPieClient } from "./submit-pie-client";
import { prisma } from "@/lib/prisma";

export default async function SubmitPie() {
  const pies: PieWithVotes[] = await prisma.pie.findMany({
    include: {
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <SubmitPieClient initialPies={pies} />;
}

export const dynamic = "force-dynamic";
