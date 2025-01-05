"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function submitVote(
  pieId: string,
  userName: string,
  stars: number
) {
  try {
    const vote = await prisma.vote.create({
      data: {
        pieId,
        userName,
        stars,
      },
    });

    revalidateTag("pieWithVotesCacheKey");
    return { success: true, vote };
  } catch (error) {
    return {
      success: false,
      error: `Failed to submit vote: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
