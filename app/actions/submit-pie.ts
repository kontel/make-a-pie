"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function submitPie(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;
    const userName = formData.get("userName") as string;

    // First create the pie without image data
    const pie = await prisma.pie.create({
      data: {
        title,
        description,
        userName: userName.replaceAll('"', ""),
        imageData: "", // Initialize with empty string
      },
    });

    // Then update with image data separately
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageData = `data:${imageFile.type};base64,${buffer.toString(
      "base64"
    )}`;

    await prisma.pie.update({
      where: { id: pie.id },
      data: { imageData },
    });

    revalidateTag("pieWithVotesCacheKey");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit pie:", error);
    return { success: false };
  }
}
