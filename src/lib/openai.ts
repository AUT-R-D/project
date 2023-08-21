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
			max_tokens: 256,
			temperature: 0,
		});

		const responseMessage = completion.data.choices[0].message;

		return responseMessage;
	} catch (error: any) {
		console.log(error);
		throw error;
	}
}
