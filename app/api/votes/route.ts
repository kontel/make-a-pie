import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Vote } from "@prisma/client";

export async function GET() {
  const votes = await prisma.vote.findMany({
    include: {
      pie: true,
    },
  });
  return NextResponse.json(votes);
}

export async function POST(request: Request) {
  const { stars, userName, pieId }: Partial<Vote> = await request.json();
  const vote = await prisma.vote.create({
    data: {
      stars: stars!,
      userName: userName!,
      pieId: pieId!,
    },
  });
  return NextResponse.json(vote);
}
