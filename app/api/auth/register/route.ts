import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/libs/prismadb";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/libs/mailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const avatarFile = formData.get("avatar") as File | null;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 },
      );
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📁 handle avatar upload
    let avatarUrl: string | null = null;

    if (avatarFile) {
      const uploadsDir = path.resolve(process.cwd(), "public", "avatars");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${avatarFile.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "-",
      )}`;

      const filePath = path.join(uploadsDir, fileName);
      const arrayBuffer = await avatarFile.arrayBuffer();

      await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));

      avatarUrl = `/avatars/${fileName}`;
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    // 💾 save user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatarUrl,
        verifyCode,
        isVerified: false,
      },
    });

    await sendVerificationEmail(user.email, verifyCode);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
