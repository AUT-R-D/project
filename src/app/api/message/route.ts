import clientPromise from "@/lib/mongodb";
import { sendMessage } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const res = await request.json();

	if (!res) {
		return NextResponse.json({ error: "Data not found" }, { status: 400 });
	}

	const message = res.message;
	const messages = res.messages || [];

	if (!message || message.length < 1) {
		return NextResponse.json({ error: "Message not found" }, { status: 400 });
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
		if (messages.length == 0) {
			messages.push({
				role: "system",
				content: "You are an unhelpful assistant.",
			});
		}

		// Commented out for now since no access to OpenAI API
		const rawResponse = await sendMessage(message, messages);

		const response = rawResponse!.content;
		//const response = `You're message was: ${message}`

		// Add the response to the messages array
		messages.push({ role: "assistant", content: response });

		await collection.updateOne(
			{ conversation_id: conversation_id },
			{ $set: { messages } },
			{ upsert: true }
		);

		return NextResponse.json({ response });
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}