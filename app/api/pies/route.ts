import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pies = await prisma.pie.findMany({
    include: {
      votes: true,
    },
  });
  return NextResponse.json(pies);
}