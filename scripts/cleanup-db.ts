import { prisma } from "@/libs/prismadb";

async function cleanup() {
  try {
    // Delete all users
    const result = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${result.count} users from database`);
    
    // Optionally delete conversations and messages too
    const convResult = await prisma.conversation.deleteMany({});
    console.log(`✅ Deleted ${convResult.count} conversations from database`);
    
    console.log("Database cleanup complete!");
  } catch (error) {
    console.log("Error cleaning database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
