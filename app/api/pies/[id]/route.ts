import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const deletedPie = await prisma.pie.delete({
      where: {
        id: context.params.id,
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
