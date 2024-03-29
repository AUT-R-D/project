"use client";
import { Message } from "@/types/message";
import { faGear, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
const { uuid } = require("uuidv4");
import { useEffect, useRef, useState } from "react";
import { Variable } from "@/types/variable";

type Settings = {
	chatbot: string;
	scenario: string;
	slang: number;
	variables: {
		[scenario: string]: Variable[];
		phone: Variable[];
		plane: Variable[];
		glasses: Variable[];
	};
};

export default function Home() {
	const [conversationID, setConversationID] = useState<string>("");

	const bottomRef = useRef<null | HTMLDivElement>(null); // Reference to the bottom of the chat

	const [inputText, setInputText] = useState(""); // Input text

	const [messages, setMessages] = useState<Message[]>([]); // Messages

	const [isLoading, setIsLoading] = useState(false); // Loading state

	const [chatbot, setChatbot] = useState<string>(""); // Chatbot model

	// ### Chat Box code ###

	// Get initial messages
	const getMessages = async (conversation_id: string) => {
		const pastMessages = Array<Message>();
		try {
			// Get past messages from database
			const response = await fetch("/api/conversations", {
				method: "POST",
				body: JSON.stringify({ conversation_id }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Parse response
			const data = await response.json();

			// Throw error if response is not ok
			if (!response.ok) {
				if (data.error) {
					throw new Error(data.error);
				} else {
					throw new Error("Network response was not ok");
				}
			}

			// Loop through the messages and add them to the array
			for (const pastMessage of data) {
				const message = new Message(
					pastMessage.role,
					pastMessage.content
				);
				pastMessages.push(message);
			}
		} catch (error: any) {
			const message = new Message("bot", null);
			if (error instanceof SyntaxError) {
				message.setError("Error connecting to database");
			} else {
				message.setError(error.message);
			}
			pastMessages.push(message);
		}

		// Return the messages
		return pastMessages;
	};

	// assigns variable name to prompt example
	const assignPrompt = function (element: string, name: String) {
		const promptDiv = document.getElementById(element);

		if (promptDiv) {
			let pTag = promptDiv.querySelector("p")!;
			if (pTag) {
				let text = pTag.textContent;

				if (text === "") {
					promptDiv.querySelector("p")!.textContent =
						"What is my " + name + "?";
				}
			}
		}
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Prevent submission if loading
		if (isLoading) return;

		// Set loading state and clear input
		setIsLoading(true);
		setInputText("");

		// Create message variables
		const inputMessage = new Message("user", inputText);
		const outputMessage = new Message("assistant", null);

		// Add messages to state
		setMessages([...messages, inputMessage, outputMessage]);

		try {
			const response = await fetch("/api/message", {
				method: "POST",
				body: JSON.stringify({
					message: inputText,
					// Send content of all messages
					messages: messages.map((message) => {
						return {
							role: message.getSender(),
							content: message.getMessage(),
						};
					}),
					conversation_id: conversationID,
					model: chatbot,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.error) {
					throw new Error(data.error);
				} else {
					throw new Error("Network response was not ok");
				}
			}

			// Set the message content
			outputMessage.setMessage(data.response);
			setIsLoading(false);
		} catch (error: any) {
			// Set the error message
			outputMessage.setError(error.message);
			setIsLoading(false);
		}
	};

	// Submit form on enter or new line on shift+enter
	const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			event.stopPropagation();
			const form = event.currentTarget.form!;

			form.requestSubmit();
		}
	};

	// Update textarea height on input and store input text
	const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputText(event.target.value);
		event.target.style.height = "24px";
		event.target.style.height = event.target.scrollHeight + "px";
		event.target.style.overflowY =
			event.target.scrollHeight > 200 ? "scroll" : "hidden";
	};

	// Resets the conversation
	const resetConversation = async () => {
		setInputText("");
		// Generate new ID
		const newID = uuid();
		// Set the new ID
		localStorage.setItem("conversationID", newID);
		setConversationID(newID);
		// Get the system message
		const systemMessageRes = await fetch("/api/system-message");
		const systemMessageJSON = await systemMessageRes.json();
		const systemMessage = new Message("system", systemMessageJSON.prompt);

		setMessages([systemMessage]);
	};

	// Get initial messages
	useEffect(() => {
		// get conversationID from local storage
		let id: string | null = localStorage.getItem("conversationID");
		if (id === null) {
			id = uuid();
			localStorage.setItem("conversationID", id!);
		}
		// set conversationID
		setConversationID(id!);
		const getInitialMessages = async () => {
			const pastMessages = await getMessages(id!);
			// If no past messages reset the ID
			if (pastMessages.length == 0) {
				const newID = uuid();
				localStorage.setItem("conversationID", newID);
				setConversationID(newID);
				const systemMessageRes = await fetch("/api/system-message");
				const systemMessageJSON = await systemMessageRes.json();
				const systemMessage = new Message(
					"system",
					systemMessageJSON.prompt
				);

				pastMessages.push(systemMessage);
			}
			setMessages(pastMessages);
		};
		getInitialMessages();

		// get settings variables...
		const getVariables = async () => {
			const response = await fetch("/api/settings", {
				method: "GET",
			});

			const data = await response.json();

			const settings: Settings = data;

			setChatbot(settings.chatbot);

			const settingsVariables = Array<Variable>();

			// add variables to settingsVariables
			for (const variable of settings.variables[settings.scenario] ||
				[]) {
				const newVariable = new Variable(variable.name, variable.value);
				settingsVariables.push(newVariable);
			}

			// set settings variables to prompt examples
			let counter = 0;
			for (const variable of settingsVariables || []) {
				counter++;
				let divId = "eg" + String(counter);
				assignPrompt(divId, variable.getName());
			}

			// if there are less than 3 variables, assign the rest to "..."
			while (counter != 3) {
				counter++;
				let divId = "eg" + String(counter);
				assignPrompt(divId, "...");
			}
		};
		getVariables();
	}, []); // Empty dependency array means this code runs once after rendering.

	// Scroll to bottom of chat box
	useEffect(() => {
		// scroll to bottom every time messages change
		if (bottomRef.current !== null) {
			bottomRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [messages]);

	return (
		<div className="overflow-hidden w-full h-full relative flex bg-gray-600">
			<div className="flex-1 overflow-hidden">
				<div className="overflow-y-auto h-full w-full">
					<div className="h-full dark:bg-gray-800">
						<div className="flex flex-col items-center text-sm dark:bg-gray-800">
							{
								// Below is the frame where all messages are displayed for the user
							}
							<div className="w-full">
								<div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800">
									<div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
										<div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
											<div>Bot: How can I help you?</div>
										</div>
									</div>
								</div>
							</div>
							{messages
								.filter(
									(message) => message.getSender() != "system"
								)
								.map((message, index) => (
									<div key={index} className="w-full">
										<div
											key={index}
											className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800"
										>
											{message.getSender() == "user" ? (
												<>
													{/* If message is seny by user display the following */}
													<div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
														<div>
															You:{" "}
															{message.getMessage()}
														</div>
													</div>
												</>
											) : (
												/* Otherwise it's a bot message or error message*/
												<div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
													<div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
														{isLoading &&
														message.getMessage() ==
															null &&
														message.getError() ==
															false ? (
															/* Display loading state */
															<div className="loading">
																Loading
															</div>
														) : message.getError() !=
														  false ? (
															/* Display Error */
															<div
																style={{
																	color: "red",
																}}
															>
																Error:{" "}
																{message.getError()}
															</div>
														) : (
															/* Display bot's response */
															<div>
																Bot:{" "}
																{message.getMessage()}
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									</div>
								))}
							{/* Used for scrolling to the bottom of the chat when sending a message */}
							<div
								className="w-full h-24 md:h-32 flex-shrink-0"
								ref={bottomRef}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 pt-4">
				{
					// Below are the 3 prompt suggestion boxes for the user
				}
				{messages.length < 2 && (
					<div
						id="promptEgs"
						className="bg-grey-800 grid grid-cols-3 mx-28 gap-x-3"
					>
						<div
							id="eg1"
							className="bg-gray-600 p-8 h-36 mx-2 mb-8 rounded-lg col-span-1 hover:bg-[#335985] focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-250 ease-in-out"
						>
							<p
								className="text-slate-300"
								onClick={(event) => {
									setInputText(
										event.currentTarget.textContent!
									);
								}}
							></p>
						</div>
						<div
							id="eg2"
							className="bg-gray-600 p-8 h-36 mx-2 mb-8 rounded-lg col-span-1 hover:bg-[#335985] focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-250 ease-in-out"
						>
							<p
								className="text-slate-300"
								onClick={(event) => {
									setInputText(
										event.currentTarget.textContent!
									);
								}}
							></p>
						</div>
						<div
							id="eg3"
							className="bg-gray-600 p-8 h-36 mx-2 mb-8 row-span-3 col-span-1 rounded-lg hover:bg-[#335985] focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-250 ease-in-out"
						>
							<p
								className="text-slate-300"
								onClick={(event) => {
									setInputText(
										event.currentTarget.textContent!
									);
								}}
							></p>
						</div>
					</div>
				)}

				{
					// Below is the submit form and input bar for the user
				}
				<form
					onSubmit={handleSubmit}
					className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
				>
					<div className="relative flex h-full flex-1 md:flex-row">
						{/* Settings Button */}
						<Link
							href={"/settings"}
							className="md:py-3 md:px-4 mr-2 rounded-md bg-slate-600 hover:bg-slate-400"
						>
							<FontAwesomeIcon icon={faGear} />
						</Link>
						{/* Input Area */}
						<div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative text-white bg-gray-700 rounded-md shadow-[0_0_15px_rgba(0,0,0,0.10)]">
							<textarea
								disabled={isLoading}
								tabIndex={0}
								rows={1}
								value={inputText}
								onChange={onChange}
								onKeyDown={onEnter}
								placeholder="Send a message..."
								style={{
									maxHeight: "200px",
									height: "24px",
									overflowY: "hidden",
								}}
								className="m-0 w-full resize-none bg-transparent outline-none p-0 pr-7 dark:bg-transparent pl-2 md:pl-0"
							/>
							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading || inputText.length == 0}
								aria-disabled={inputText.length == 0}
								className="absolute p-1 rounded-md aria-disabled:text-gray-400 text-gray-300 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
							>
								Submit
							</button>
						</div>
						{/* Reset Button */}
						<button
							type="reset"
							onClick={resetConversation}
							className="md:py-3 md:px-4 ml-2 rounded-md bg-slate-600 hover:bg-slate-400"
						>
							<FontAwesomeIcon icon={faTrash} />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
