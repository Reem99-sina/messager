import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismadb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pusherServer } from "@/libs/pusher";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.toString().trim();
    const password = body.password?.toString().trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (!existingUser.isVerified) {
      return NextResponse.json(
        {
          error: "Email is not verified.",
          verifyEmail: true,
          email: existingUser.email,
        },
        { status: 403 },
      );
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );
    await pusherServer.trigger("presence-online-users", "user-online", {
      userId: existingUser.id,
    });
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        avatarUrl: existingUser.avatarUrl,
      },
    });
  } catch (error) {
   
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
