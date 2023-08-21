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
  const conversations = db.collection("conversations");
  const settings = (await db.collection("settings").findOne({})) as any;

  const prompt = [
    "Pretend you are a helpful chatbot for a phone company. You will not be dealing with real information or real customers.",
    "You must speak with a formality level (out of 10, where 10 is very formal and 0 uses lots of slang): 8",
    "Your purpose is to use the predefined variables below to retrieve the required user information for the specific query that the user asks for.",
    "Once you have retrieved the query from the user, check if it's defined below.",
    "If so, then collect the required user information for the requested variable, then print out their information in JSON format, but don't tell the user beforehand.",
    'When you make the JSON, please separate the requested variable from the user\'s provided information, by adding a row like: "request":"<insert requested variable>".',
    "If a variable isn't predefined, say that you can't help them.",
    "Remember that I am the user so you should not simulate a conversation, and you should not assume what I will ask for.",
    "Below are the defined queries and the required information for that query, remember not to tell me what variables are available before I query for one:",
  ];

  for (const variable of Object.values(settings.variables) as {
    name: string;
    value: string;
  }[]) {
    prompt.push(
      `Variable '${variable.name.trim()}': '${variable.value.trim()}'`
    );
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
