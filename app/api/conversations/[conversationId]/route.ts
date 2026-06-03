import { prisma } from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/action/getCurrentUser";
import { User } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const currentUser = await getCurrentUser({
      token: request.headers.get("authorization")?.replace("Bearer ", ""),
    }) as User | undefined;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const { conversationId } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
       
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
            seenBy: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation Not Found", {
        status: 404,
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}