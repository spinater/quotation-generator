import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if receipt exists
    const receipt = await prisma.receipt.findUnique({
      where: { id },
    });

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    // Soft delete - set deletedAt timestamp
    await prisma.receipt.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Receipt deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete receipt",
      },
      { status: 500 }
    );
  }
}
