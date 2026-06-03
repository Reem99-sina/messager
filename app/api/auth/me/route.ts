import { NextResponse } from "next/server";
import { prisma } from "@/libs/prismadb";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required." },
        { status: 401 },
      );
    }

    // Verify JWT token
    let decoded: {id:string} | jwt.JwtPayload|string;
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
      where: { id: (decoded as {id:string})?.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
   
    return NextResponse.json(
      { error: "Unable to fetch user data." },
      { status: 500 },
    );
  }
}


