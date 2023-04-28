"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const bottomRef = useRef<null | HTMLDivElement>(null);

	const [inputText, setInputText] = useState("");

	const [inputList, setInputList] = useState<string[]>([]);
	const [outputList, setOutputList] = useState<string[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const [popupVisible, setPopupVisible] = useState(false);

	function togglePopup() {
		setPopupVisible(!popupVisible);
	}

	// Chat Box code

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isLoading || isError) return;

		setIsLoading(true);
		setIsError(false);
		setInputText("");

		setInputList([...inputList, inputText]);

		try {
			const response = await fetch("http://localhost:5000/message", {
				method: "POST",
				body: JSON.stringify({ message: inputText }),
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

			setOutputList([...outputList, data.response]);
			setIsLoading(false);
		} catch (error: any) {
			console.log("Adding error message");
			setOutputList([...outputList, error.message]);
			setIsError(true);
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

	// Scroll to bottom of chat box
	useEffect(() => {
		// 👇️ scroll to bottom every time messages change
		if (bottomRef.current === null) {
		} else {
			bottomRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [inputList]);

	return (
		<main>
			<div className="overflow-hidden w-full h-full relative flex bg-gray-600">
				<div className="flex-1 overflow-hidden">
					<div className="overflow-y-auto h-full w-full">
						<div className="h-full dark:bg-gray-800">
							<div className="flex flex-col items-center text-sm dark:bg-gray-800">
								{inputList.map((input, index) => (
									<div key={index} className="w-full">
										<div
											key={index}
											className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800"
										>
											<div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
												<div>Input: {input}</div>
											</div>
										</div>
										<div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
											<div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
												{isLoading &&
												outputList[index] == null ? (
													<div className="loading">
														Loading
													</div>
												) : isError &&
												  index ==
														outputList.length -
															1 ? (
													<div
														style={{ color: "red" }}
													>
														Error:{" "}
														{outputList[index]}
													</div>
												) : (
													<div>
														{outputList[index]}
													</div>
												)}
											</div>
										</div>
									</div>
								))}
								<div
									className="w-full h-24 md:h-32 flex-shrink-0"
									ref={bottomRef}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 pt-4">
					<form
						onSubmit={handleSubmit}
						className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
					>
						<div className="relative flex h-full flex-1 md:flex-col">
							<div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative text-white bg-gray-700 rounded-md shadow-[0_0_15px_rgba(0,0,0,0.10)]">
								<textarea
									disabled={isLoading || isError}
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
								<button
									type="submit"
									disabled={isLoading || isError}
									className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
								>
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
}
