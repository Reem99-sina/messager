// /api/pusher/auth
import { getCurrentUser } from "@/action/getCurrentUser";
import { pusherServer } from "@/libs/pusher";
import { User } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.formData();

  const socketId = body.get("socket_id") as string;
  const channel = body.get("channel_name") as string;

  const user = (await getCurrentUser({
    token: req.headers.get("authorization")?.replace("Bearer ", ""),
  })) as User | undefined;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const authResponse = pusherServer.authorizeChannel(socketId, channel, {
    user_id: user?.id,
    user_info: {
      name: user?.name,
    },
  });

  return Response.json(authResponse);
}
