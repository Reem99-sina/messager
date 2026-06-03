import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismadb";
import { getCurrentUser } from "@/action/getCurrentUser";
import { User } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = (await getCurrentUser({
      token: request.headers.get("authorization")?.replace("Bearer ", ""),
    })) as User;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const { id } = await params;

    const message = await prisma.message.findUnique({
      where: {
        id: id,
      },
      include: {
        seenBy: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
          orderBy: {
            seenAt: "desc",
          },
        },
      },
    });

    if (!message) {
      return new NextResponse("Message not found", {
        status: 404,
      });
    }

    return NextResponse.json(message.seenBy);
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}