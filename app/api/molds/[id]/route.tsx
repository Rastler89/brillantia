import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

async function getSession() {
  return await getServerSession();
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    const {id} = await params;
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const mold = await db.mold.findUnique({
            where: { id: parseInt(id) },
        })

        if(!mold) {
            return NextResponse.json({error: 'Molde no encontrado'},{status: 404})
        }

        return NextResponse.json({
            ...mold, 
            jewelryIds: mold.jewelryIds ?? [], 
            techniques: mold.techniques ?? [],
            dimensions: mold.dimensions ?? [],
            castingMaterial: mold.castingMaterial ?? [],
        })
    } catch (error) {
        return NextResponse.json({error: 'Error al buscar el molde', message: error},{status: 500})
    }
}