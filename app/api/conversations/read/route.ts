import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismadb";
import { getCurrentUser } from "@/action/getCurrentUser";
import { User } from "@prisma/client";
import { pusherServer } from "@/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = (await getCurrentUser({
      token: request.headers.get("authorization")?.replace("Bearer ", ""),
    })) as User;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { conversationId } = await request.json();

    if (!conversationId) {
      return new NextResponse("Missing conversationId", { status: 400 });
    }

    const now = new Date();

    // 1. update lastReadAt
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: currentUser.id,
      },
      data: {
        lastReadAt: now,
      },
    });

    // 2. mark messages as seen
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        senderId: {
          not: currentUser.id,
        },
      },
    });

    for (const msg of messages) {
      await prisma.messageSeen.upsert({
        where: {
          messageId_userId: {
            messageId: msg.id,
            userId: currentUser.id,
          },
        },
        update: {
          seenAt: now,
        },
        create: {
          messageId: msg.id,
          userId: currentUser.id,
          seenAt: now,
        },
      });
    }
    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "conversation:read",
      {
        userId: currentUser.id,
        lastReadAt: now,
      },
    );
   
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
