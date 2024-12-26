import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const pies = await prisma.pie.findMany({
    include: {
      votes: true,
    },
  })
  return NextResponse.json(pies)
}

export async function POST(request: Request) {
  const { title, description, imageData, userName } = await request.json()
  const pie = await prisma.pie.create({
    data: {
      title,
      description,
      imageData,
      userName,
    },
  });
  return NextResponse.json(pie)
}

