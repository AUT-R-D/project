import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {

    const client = await clientPromise;
    const db = client.db("info-flow");
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

    return NextResponse.json({ prompt: prompt.join("\n") });
}