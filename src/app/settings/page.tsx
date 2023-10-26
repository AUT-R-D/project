"use client";
import { Variable } from "@/types/variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
	const router = useRouter();
	const [variables, setVariables] = useState<Settings["variables"]>({
		phone: Array<Variable>(),
		plane: Array<Variable>(),
		glasses: Array<Variable>(),
	}); // setting array of variables as state
	const [scenario, setScenario] = useState("plane"); // scenario setting
	const [chatbot, setChatbot] = useState("gpt-4"); // chatbot setting
	const [chatbotChanged, setChatbotChanged] = useState<{
		old: string;
		new: null | string;
	}>({ old: chatbot, new: null }); // Check for if the chat bot has been changed
	const [slang, setSlang] = useState(5); // slang setting
	const [saved, setSaved] = useState(true); // saved setting

	function addPlus() {
		if (saved) setSaved(false);
		const input = document.getElementById(
			"variableName"
		) as HTMLInputElement;

		if (input.value == "") return;

		// Create new variable and add to the array for the scenario
		const newVariable = new Variable(input.value, "");
		setVariables((prev) => {
			const updated = { ...prev };
			updated[scenario].push(newVariable);
			return updated;
		});
		input.value = "";
	}

	// Remove variable from array
	function removeVariable(index: number) {
		if (saved) setSaved(false);
		setVariables((prev) => {
			const updated = { ...prev };
			updated[scenario].splice(index, 1);
			return updated;
		});
	}

	// Update variable value
	function updateVariableValue(
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) {
		if (saved) setSaved(false);

		setVariables((prev) => {
			const updated = { ...prev };
			updated[scenario][index].setValue(event.target.value);
			return updated;
		});
	}

	// Save chatbot setting and remove conversationID from local storage
	function saveChatbot() {
		if (
			chatbotChanged.new != null &&
			chatbotChanged.new != chatbotChanged.old
		) {
			localStorage.removeItem("conversationID");
			setChatbotChanged({ old: chatbot, new: null });
		}
	}

	// Get initial messages
	useEffect(() => {
		const getVariables = async () => {
			const response = await fetch("/api/settings", {
				method: "GET",
			});

			const data = await response.json();

			// If there is an error, create new settings
			if (data.error) {
				const settings: Settings = {
					chatbot,
					scenario,
					slang,
					variables,
				};

				await fetch("/api/settings", {
					method: "POST",
					body: JSON.stringify(settings),
				});
			}

			const settings: Settings = data;

			const newVariables: Settings["variables"] = {
				phone: Array<Variable>(),
				plane: Array<Variable>(),
				glasses: Array<Variable>(),
			};

			// Add variables to each scenario
			for (const scenario in settings.variables) {
				for (const variable of settings.variables[scenario]) {
					const newVariable = new Variable(
						variable.name,
						variable.value
					);
					newVariables[scenario].push(newVariable);
				}
			}

			// Set settings in state
			setScenario(settings.scenario);
			setChatbot(settings.chatbot);
			setVariables(newVariables);
			setSlang(settings.slang);
			setChatbotChanged({ old: settings.chatbot, new: null });
		};

		getVariables();
	}, []);

	return (
		<div className="flex items-center justify-center">
			<div className="w-1/3 bg-white p-8 rounded-3xl shadow-md text-center justify-center">
				<h2 className="text-xl text-black font-bold mb-4">Settings</h2>

				<div className="flex space-x-2 justify-center">
					{/* Scenario select */}
					<select
						className="rounded-lg p-2"
						value={scenario}
						onChange={(event) => {
							setSaved(false);
							setScenario(event.target.value);
						}}
					>
						<option value="phone">Phone</option>
						<option value="plane">Plane</option>
						<option value="glasses">Glasses</option>
					</select>
					{/* Chatbot select */}
					<select
						className="rounded-lg p-2"
						value={chatbot}
						onChange={(event) => {
							setSaved(false);
							setChatbot(event.target.value);
							setChatbotChanged({
								old: chatbotChanged.old,
								new: event.target.value,
							});
						}}
					>
						<option value="gpt-3.5">Chat GTP 3.5</option>
						<option value="gpt-4">Chat GTP 4</option>
					</select>
				</div>
				<div>
					{/* Slang Input */}
					<label className="block text-gray-700 font-bold text-lg pt-3">
						Slang
					</label>
					<input
						type="number"
						min={0}
						max={10}
						maxLength={2}
						className="border border-gray-300 p-2 rounded-md"
						value={slang}
						onChange={(event) => {
							if (parseInt(event.target.value) > 10) {
								event.target.value = "10";
							} else if (parseInt(event.target.value) < 0) {
								event.target.value = "0";
							} else if (event.target.value == "") {
								event.target.value = "0";
							} else if (event.target.value.length > 2) {
								event.target.value = event.target.value.slice(
									0,
									2
								);
							}
							setSaved(false);
							setSlang(parseInt(event.target.value));
						}}
					/>
				</div>

				{/* Variables */}
				{variables[scenario].map((variable, index) => {
					return (
						<div id={`var-${index}`} className="pt-3" key={index}>
							<div className="flex flex-row justify-center items-center space-x-1 mb-2">
								{/* Variable Name */}
								<label
									htmlFor={`input-${index}`}
									className="block text-gray-700 font-bold text-lg"
									id={`label-${index}`}
								>
									{variable.getName()}
								</label>
								{/* Remove variable button */}
								<button
									className="flex w-5 h-5 rounded bg-black items-center"
									id={`remove-${index}`}
									title="Remove variable"
									onClick={() => {
										removeVariable(index);
									}}
								>
									<FontAwesomeIcon
										icon={faMinus}
										className="text-white mx-auto"
									/>
								</button>
							</div>

							{/* Variable Value */}
							<input
								id={`input-${index}`}
								type="text"
								className="border border-gray-300 p-2 rounded-md"
								value={variable.getValue()}
								onChange={(event) => {
									updateVariableValue(index, event);
								}}
							></input>
						</div>
					);
				})}

				{/* Add variable */}
				<div className="mt-5">
					<p className="text-black font-semibold text-lg">
						Create new variable
					</p>
					<div className="flex flex-row justify-center items-center space-x-1">
						<input
							id="variableName"
							type="text"
							className="border border-gray-300 p-2 rounded-md"
							placeholder="New Variable Name"
						/>
						<button
							className="flex w-8 h-8 rounded-lg bg-black items-center"
							id="addBtn"
							title="Add variable"
							onClick={addPlus}
						>
							<FontAwesomeIcon
								icon={faPlus}
								className="text-white mx-auto"
							/>
						</button>
					</div>
				</div>
				
				{/* Warning about changing chatbot */}
				{chatbotChanged.new != null &&
					chatbotChanged.new != chatbotChanged.old && (
						<div className="text-black bg-red-500 p-4 mt-5 rounded-lg">
							Changing the chatbot setting will reset the
							conversation.
						</div>
					)}

				{/* Save and discard buttons */}
				<button
					className="block mt-4 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mx-auto"
					onClick={async () => {
						const settings: Settings = {
							chatbot,
							scenario,
							slang,
							variables,
						};

						await fetch("/api/settings", {
							method: "POST",
							body: JSON.stringify(settings),
						});
						setSaved(true);
						saveChatbot();
					}}
					disabled={saved}
				>
					Save Settings
				</button>
				<button
					className="mt-4 bg-red-500 hover:bg-red-700 aria-disabled:bg-gray-500 aria-disabled:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => {
						router.push("/");
					}}
					aria-disabled={saved}
				>
					{saved ? "Back" : "Discard"}
				</button>
			</div>
		</div>
	);
}
