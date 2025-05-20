import { connectDB } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!req.body)
    return NextResponse.json({ error: "no body" }, { status: 500 });

  try {
    const db = (await connectDB).db("bbb");
    const session = await req.json();
    const id = session.id;
    const song = await db.collection("song_list").findOne({ id: id });
    if (song)
      return NextResponse.json(
        { errorCode: 1, error: "이미 추가된 노래입니다" },
        { status: 500 }
      );

    const res = await db.collection("song_list").insertOne(session);
    return await NextResponse.json(res, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
