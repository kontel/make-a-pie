import  { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest
) {
  try {
    const pieId = request.nextUrl.pathname.split('/').pop();

    const deletedPie = await prisma.pie.delete({
      where: {
        id: pieId!,
      },
    });

    return NextResponse.json(deletedPie);

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete pie: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

