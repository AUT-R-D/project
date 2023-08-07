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
		return NextResponse.json(
			{ error: "Message not found" },
			{ status: 400 }
		);
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
	const conversations = db.collection("conversations");
	const settings = (await db.collection("settings").findOne({})) as any;

	const prompt = [
		`Pretend you are a chatbot for an ${settings.scenario} company. `,
		`You must speak with slang level (out of 10): ${settings.slag || 5} `,
		``,
		`Here's an example of a conversation: `,
		`Chatbot: how can I help you today? `,
		`User: I want to know my policy number. `,
		`Chatbot: Sure! What is your full name? `,
		`User: Mike Ross `,
		`Chatbot: Thanks Mike! What is your type of insurance? `,
		`User: comprehensive home insurance. `,
		`Chatbot: And when did you sign up for this insurance cover? `,
		`User: 25/4/21 `,
		`Chatbot: OK! Your policy number is 34720. Is there anything else you want me to help you with today? `,
		`User: Its ok. `,
		`Chatbot: Okay! Ill be waiting! `,
		``,
		`The variables below and the required information from the user are:`,
	];

	for (const variable of Object.values(settings.variables) as {
		name: string;
		value: string;
	}[]) {
		prompt.push(`Variable '${variable.name.trim()}': '${variable.value.trim()}'`);
	}

	try {
		if (messages.length == 0) {
			messages.push({
				role: "system",
				content: prompt.join("\n"),
			});
		}

		// Commented out for now since no access to OpenAI API
		const rawResponse = await sendMessage(message, messages);

		const response = rawResponse!.content;
		//const response = `You're message was: ${message}`

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
