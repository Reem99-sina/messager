import { prisma } from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code?.toString().trim();
    const email = body.email?.toString().trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 },
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
   
    // Placeholder verification logic.
    // Replace this with your real verification-token check later.
    if (code !== existingUser?.verifyCode) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 },
      );
    }
    const user = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verifyCode: null, // Clear the code after successful verification
      },
    });
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch  {
    
    return NextResponse.json(
      { error: "Unable to verify email." },
      { status: 500 },
    );
  }
}
