import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismadb";


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        isVerified: true,
      },
    });

    const response = users.map((user) => ({
      ...user,
      isOnline: [],
    }));

    return NextResponse.json({ success: true, users: response });
  } catch  {
    
    return NextResponse.json(
      { error: "Unable to load users." },
      { status: 500 },
    );
  }
}
