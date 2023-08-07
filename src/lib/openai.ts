import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

if (!process.env.OPENAI_API_KEY) {
	throw new Error("Invalid/Missing environment variable: 'OPENAI_API_KEY'");
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = new Configuration({
	apiKey: OPENAI_API_KEY,
	organization: "org-JsRvjNdTqRuBJYUyKLXu9y3w",
});

const openai = new OpenAIApi(config);

// Goal
// 1 - Ensure prompt only occurs once per conversation (at the start)
// 2 - To use user-set variables within the prompt below (Type of company, slang and variables).
// 3 - To have all key information from user be saved into our mongo DB.

const prompt = "Pretend you are a chatbot for an insurance company. \
You must speak with slang level (out of 10): " + settingsVar.slang + " \
\
The variables below and the required information from the user are: \
1) policy number: requires full name, type of insurance, and date of insurance. \
2) Customer address: requires full name, and date of sign up with this company. \
\
Here's an example of a conversation: \
Chatbot: how can I help you today? \
User: I want to know my policy number. \
Chatbot: Sure! What is your full name? \
User: Mike Ross \
Chatbot: Thanks Mike! What is your type of insurance? \
User: comprehensive home insurance. \
Chatbot: And when did you sign up for this insurance cover? \
User: 25/4/21 \
Chatbot: OK! Your policy number is 34720. Is there anything else you want me to help you with today? \
User: Its ok. \
Chatbot: Okay! Ill be waiting! \
\
Conversation begin";

export async function sendMessage(
	message: string,
	messages: ChatCompletionRequestMessage[]
) {
	try {
		//messages.push({ role: "user", content: prompt + message });
		messages.push({ role: "user", content: message });

		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages,
		});

		const responseMessage = completion.data.choices[0].message;

		return responseMessage;
	} catch (error: any) {
		console.log(error);
		throw error;
	}
}
