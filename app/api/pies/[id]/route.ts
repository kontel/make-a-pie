import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(_request: NextRequest, { params }: Props) {
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
