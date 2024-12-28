import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteSegmentContext = {
  params: {
    id: string;
  };
};

export async function DELETE(
  req: NextRequest,
  { params }: RouteSegmentContext
) {
  try {
    const deletedPie = await prisma.pie.delete({
      where: {
        id: params.id,
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
