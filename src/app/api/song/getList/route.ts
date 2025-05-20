import { connectDB } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = (await connectDB).db("bbb");
    const result = await db.collection("song_list").find().toArray();
    return await NextResponse.json(result, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
