"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function submitPie(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageData = formData.get("imageData") as string; // Now expecting base64 string directly
    const userName = formData.get("userName") as string;

    // Create the pie with compressed image data
    await prisma.pie.create({
      data: {
        title,
        description,
        userName: userName.replaceAll('"', ""),
        imageData, // Use the compressed image data directly
      },
    });

    revalidateTag("pieWithVotesCacheKey");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit pie:", error);
    return { success: false };
  }
}
