import { pusherServer } from "@/libs/pusher";

export async function POST(req: Request) {
  const body = await req.json();

  // await pusherServer.trigger("presence-users", "user-offline", {
  //   userId: body.userId,
  // });
  pusherServer.trigger("presence-online-users", "user-offline", {
  userId: body.userId,
});

  return Response.json({ success: true });
}