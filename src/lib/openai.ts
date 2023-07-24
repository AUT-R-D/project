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

export async function sendMessage(
	message: string,
	messages: ChatCompletionRequestMessage[]
) {
	try {
		messages.push({ role: "user", content: message });

		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
		});

		const responseMessage = completion.data.choices[0].message;

		return responseMessage;
	} catch (error: any) {
		console.log(error);
		throw error;
	}
}
