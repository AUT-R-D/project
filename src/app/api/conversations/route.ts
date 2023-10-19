import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

/* Fetch conversations from database */
export async function POST(request: NextRequest) {
	const res = await request.json();

	if (!res) {
		return NextResponse.json({ error: "Data not found" }, { status: 400 });
	}

	const conversation_id = res.conversation_id;

	if (!conversation_id) {
		return NextResponse.json(
			{ error: "No conversation ID found" },
			{ status: 400 }
		);
	}

	const client = await clientPromise;
	const db = client.db("info-flow");
	const collection = db.collection("conversations");

	try {
		const document = await collection.findOne({
			conversation_id: conversation_id,
		});

		if (!document) {
			return NextResponse.json([], { status: 200 });
		}

		return NextResponse.json(document.messages, { status: 200 });
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
