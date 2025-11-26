import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if quotation exists
    const quotation = await prisma.quotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    // Soft delete - set deletedAt timestamp
    await prisma.quotation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Quotation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete quotation",
      },
      { status: 500 }
    );
  }
}
