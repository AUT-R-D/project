import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const client = await clientPromise;
		return new Response("Database connected");
	} catch (error: any) {
		return NextResponse.json({ error: true, message: error.message });
	}
}
