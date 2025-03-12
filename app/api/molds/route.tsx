import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getSession() {
  return await getServerSession(authOptions);
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const molds = await db.mold.findMany();
    return NextResponse.json(molds);
  } catch (error) {
    console.error("Error fetching molds", error);
    return NextResponse.json({error: "Error fetching molds"}, {status: 500})
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newMold = await db.mold.create({
      data: body
    });
    
    return NextResponse.json(newMold, {status: 201});
  } catch(error) {
    console.error("Error creating mold", error);
    return NextResponse.json({error: "Error creating mold"}, {status: 500})
  }
}