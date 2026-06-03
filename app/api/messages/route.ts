import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismadb";
import { getCurrentUser } from "@/action/getCurrentUser";
import { pusherServer } from "@/libs/pusher";
import { User } from "@prisma/client";
import { uploadToCloudinary } from "@/action/uploadCloudinary";

export async function POST(request: Request) {
  try {
    const currentUser = (await getCurrentUser({
      token: request.headers.get("authorization")?.replace("Bearer ", ""),
    })) as User;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const formData = await request.formData();

    const conversationId = formData.get("conversationId") as string;
    const messageBody = formData.get("body") as string;
    const image = formData.get("image") as File | null;

    if (!conversationId || (!messageBody?.trim() && !image)) {
      return new NextResponse("Invalid data", {
        status: 400,
      });
    }
    let imageUrl: string | null = null;
    let imageName: string | null = null;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await uploadToCloudinary({buffer:buffer});

      imageUrl = uploaded.secure_url;
      imageName = image.name;
    }
    // 1. check conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // 2. create message
    const message = await prisma.message.create({
      data: {
        body: messageBody,
        imageUrl,
        imageName,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser?.id,
          },
        },
      },
      include: {
        sender: true,
      },
    });

    conversation.participants.forEach((p) => {
      pusherServer.trigger(
        `conversation-${conversationId}`,
        "message:new",
        message,
      );
    });
    return NextResponse.json(message);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
