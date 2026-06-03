import { getCurrentUser } from "@/action/getCurrentUser";
import { prisma } from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = (await getCurrentUser({
      token: request.headers.get("authorization")?.replace("Bearer ", ""),
    })) as User | undefined;
    const body = await request.json();
    const { isGroup, name, members, userId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("unauthenticated ", { status: 400 });
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("invalid data ", { status: 400 });
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          title: name,

          participants: {
            create: [
              ...members.map((ele: { value: string }) => ({ id: ele?.value })),
              { id: currentUser?.id },
            ],
          },
        },
        include: {
          participants: true,
        },
      });
      newConversation.participants.forEach((user) => {
        if (user?.id) {
          pusherServer.trigger(user?.id, "conversation:new", newConversation);
        }
      });
      return NextResponse.json(newConversation);
    }

    const existedConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { userId: currentUser.id },
            },
          },
          {
            participants: {
              some: { userId: userId },
            },
          },
        ],
      },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    if (existedConversation) {
      return NextResponse.json(existedConversation);
    }
    const newConversation = await prisma.conversation.create({
      data: {
        title: name ?? "",
        participants: {
          create: [
            {
              user: {
                connect: {
                  id: currentUser.id,
                },
              },
            },
            {
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    newConversation.participants.forEach((user) => {
      if (user?.id) {
        pusherServer.trigger(user?.id, "conversation:new", newConversation);
      }
    });
    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("internal error ", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = (await getCurrentUser({
      token: request.headers.get("authorization")?.replace("Bearer ", ""),
    })) as User | undefined;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {},
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const existedConversation = conversations.filter((conversation) => {
      const ids = conversation.participants.map((p) => p.userId);

      return ids.includes(currentUser.id);
    });

    return NextResponse.json(existedConversation);
  } catch (error) {
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
