import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedPie = await prisma.pie.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(deletedPie);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete pie" },
      { status: 500 }
    );
  }
}
