import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const votes = await prisma.vote.findMany({
    include: {
      pie: true,
    },
  })
  return NextResponse.json(votes)
}

export async function POST(request: Request) {
  const { stars, userName, pieId } = await request.json()
  const vote = await prisma.vote.create({
    data: {
      stars,
      userName,
      pieId,
    },
  })
  return NextResponse.json(vote)
}

