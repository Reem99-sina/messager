import { JWT_SECRET } from "@/app/api/auth/me/route";
import { prisma } from "@/libs/prismadb";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const getCurrentUser = async ({ token }: { token?: string }) => {
  let decoded: { id: string } | jwt.JwtPayload | string;
  if(!token) return
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 401 },
    );
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { id: (decoded as { id: string })?.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });
  return user;
};
