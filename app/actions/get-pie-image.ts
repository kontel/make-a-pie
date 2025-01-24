'use server'

import { prisma } from "@/lib/prisma";

export async function getPieImage(pieId: string) {
  const pie = await prisma.pie.findUnique({
    where: { id: pieId },
    select: { imageData: true },
  });
  
  return pie?.imageData;
} 