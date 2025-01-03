"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePie(pieId: string) {
  try {
    await prisma.pie.delete({
      where: {
        id: pieId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete pie:", error);
    return { success: false };
  }
}
