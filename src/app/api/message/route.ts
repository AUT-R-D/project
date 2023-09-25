import clientPromise from "@/lib/mongodb";
import { sendMessage } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

function extractJSON(str: string) {
	let firstOpen = 0;
	let firstClose;
	let candidate;
	firstOpen = str.indexOf("{", firstOpen + 1);
	do {
		firstClose = str.lastIndexOf("}");
		if (firstClose <= firstOpen) {
			return null;
		}
		do {
			candidate = str.substring(firstOpen, firstClose + 1);
			try {
				let res = JSON.parse(candidate);
				return res
			} catch (ignored) {}
			firstClose = str.substr(0, firstClose).lastIndexOf("}");
		} while (firstClose > firstOpen);
		firstOpen = str.indexOf("{", firstOpen + 1);
	} while (firstOpen != -1);
}

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

	const model = res.model;

	if (!model) {
		return NextResponse.json(
			{
				error: "No model provided",
			},
			{ status: 400 }
		);
	}

	const client = await clientPromise;
	const db = client.db("info-flow");
	const conversations = db.collection("conversations");
	const userData = db.collection("user-data");

	try {
		// Commented out for now since no access to OpenAI API
		const rawResponse = await sendMessage(message, messages, model);

		if (!rawResponse) {
			return NextResponse.json(
				{ error: "No response from Chatbot" },
				{ status: 500 }
			);
		}

		const response = rawResponse.content;

		if (!response) {
			return NextResponse.json(
				{ error: "No response from Chatbot" },
				{ status: 500 }
			);
		}

		// Extract the JSON from the response
		const json = extractJSON(response);

		if (json) {
			console.log("JSON Found in response")

			await userData.updateOne(
				{ conversation_id: conversation_id },
				{ $set: { data: json } },
				{ upsert: true }
			);
		}

		// Add the response to the messages array
		messages.push({ role: "assistant", content: response });

		await conversations.updateOne(
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
