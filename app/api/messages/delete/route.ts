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

    const { messageId } = await request.json();

    if (!messageId) {
      return new NextResponse("Missing messageId", { status: 400 });
    }

    // check message ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (message.senderId !== currentUser.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    await pusherServer.trigger(
      `conversation-${message.conversationId}`,
      "message:delete",
       message ,
    );
    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ messageId });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
