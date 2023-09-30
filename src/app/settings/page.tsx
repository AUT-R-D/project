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
	variables: Variable[];
};

export default function Home() {
	const router = useRouter();
	const [variables, setVariables] = useState(Array<Variable>()); // setting array of variables as state
	const [scenario, setScenario] = useState("plane"); // scenario setting
	const [chatbot, setChatbot] = useState("chat-gpt"); // chatbot setting
	const [chatbotChanged, setChatbotChanged] = useState<{
		old: string;
		new: null | string;
	}>({ old: chatbot, new: null }); // Check for if the chat bot has been changed
	const [slang, setSlang] = useState(5); // slang setting
	const [saved, setSaved] = useState(true); // saved setting

	function addPlus() {
		if (saved) setSaved(false);
		const newVariableName = (
			document.getElementById("variableName") as HTMLInputElement
		).value;

		const newVariable = new Variable(newVariableName, "");

		setVariables([...variables, newVariable]);
	}

	function removeVariable(index: number) {
		if (saved) setSaved(false);
		const newVariables = [...variables];
		newVariables.splice(index, 1);
		setVariables(newVariables);
	}

	function updateVariableValue(
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) {
		if (saved) setSaved(false);
		const newVariables = [...variables];
		newVariables[index].setValue(event.target.value);
		setVariables(newVariables);
	}

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

			const newVariables = Array<Variable>();

			for (const variable of settings.variables || []) {
				const newVariable = new Variable(variable.name, variable.value);
				newVariables.push(newVariable);
			}

			setScenario(settings.scenario);
			setChatbot(settings.chatbot);
			setVariables(newVariables);
			setSlang(settings.slang);
		};

		getVariables();
	}, []);

	return (
		<div className="flex items-center justify-center">
			<div className="w-1/3 bg-white p-8 rounded-3xl shadow-md text-center justify-center">
				<h2 className="text-xl text-black font-bold mb-4">Settings</h2>

				<div className="flex space-x-2 justify-center">
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

							console.log(chatbotChanged);
						}}
					>
						<option value="gpt-3.5">Chat GTP 3.5</option>
						<option value="gpt-4">Chat GTP 4</option>
						<option value="dialog">Dialog Flow</option>
						<option value="wit">Wit.ai</option>
						<option value="lex">Amazon Lex</option>
					</select>
				</div>
				<div>
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
								event.target.value = event.target.value.slice(0, 2);
							}
							setSaved(false);
							setSlang(parseInt(event.target.value));
						}}
					/>
				</div>

				{variables.map((variable, index) => {
					return (
						<div id={`var-${index}`} className="pt-3" key={index}>
							<div className="flex flex-row justify-center items-center space-x-1 mb-2">
								<label
									htmlFor={`input-${index}`}
									className="block text-gray-700 font-bold text-lg"
									id={`label-${index}`}
								>
									{variable.getName()}
								</label>
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
							<FontAwesomeIcon icon={faPlus} className="text-white mx-auto" />
						</button>
					</div>
				</div>
				{chatbotChanged.new != null &&
					chatbotChanged.new != chatbotChanged.old && (
						<div className="text-black bg-red-500 p-4 mt-5 rounded-lg">
							Notice about changing chat bot goes here. Tell user that
							conversation will be reset.
						</div>
					)}

				<button
					className="block mt-4 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mx-auto"
					onClick={async (event) => {
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
