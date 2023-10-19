import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

if (!process.env.OPENAI_API_KEY) {
	throw new Error("Invalid/Missing environment variable: 'OPENAI_API_KEY'");
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = new Configuration({
	apiKey: OPENAI_API_KEY,
	organization: "org-JsRvjNdTqRuBJYUyKLXu9y3w",
});


const models: {[key: string]: string} = {
	"gpt-3.5": "gpt-3.5-turbo",
	"gpt-4": "gpt-4"
}

const openai = new OpenAIApi(config);

/**
 * Sends a message to the OpenAI API and returns the response
 * @param message The message to send
 * @param messages History of messages
 * @param model Which model to use
 * @returns Response message
 */
export async function sendMessage(
	message: string,
	messages: ChatCompletionRequestMessage[],
	model: string
) {
	try {
		
		// Add the user's message to the history
		messages.push({ role: "user", content: message });

		// Send the message to the OpenAI API
		const completion = await openai.createChatCompletion({
			model: models[model],
			messages,
			max_tokens: 256,
			temperature: 0,
		});

		// Get the response message
		const responseMessage = completion.data.choices[0].message;

		return responseMessage;
	} catch (error: any) {
		console.log(error);
		throw error;
	}
}
