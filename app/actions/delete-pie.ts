"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePie(pieId: string) {
  try {
    // First delete all votes associated with this pie
    await prisma.vote.deleteMany({
      where: {
        pieId: pieId,
      },
    });

    // Then delete the pie
    await prisma.pie.delete({
      where: {
        id: pieId,
      },
    });

    revalidatePath("/");
    return { success: true } as const;
  } catch (error) {
    console.error("Failed to delete pie:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    } as const;
  }
}
