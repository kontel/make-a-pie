"use server";

import { prisma } from "@/lib/prisma";

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
    return { success: true, vote };
  } catch (error) {
    return { success: false, error: "Failed to submit vote" };
  }
}
