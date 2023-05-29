"use client";
import { Variable } from "@/types/variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useState } from "react";

export default function Home() {
	const [variables, setVariables] = useState(Array<Variable>()); // setting array of variables as state

	function addPlus() {
		const newVariableName = (
			document.getElementById("variableName") as HTMLInputElement
		).value;

		const newVariable = new Variable(newVariableName, "");

		setVariables([...variables, newVariable]);
	}

	function removeVariable(index: number) {
		const newVariables = [...variables];
		newVariables.splice(index, 1);
		setVariables(newVariables);
	}

	function updateVariableValue(
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) {
		const newVariables = [...variables];
		newVariables[index].setValue(event.target.value);
		setVariables(newVariables);
	}

	return (
		<div className="h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
			<div className="w-1/3 bg-white p-8 rounded-3xl shadow-md text-center justify-center">
				<h2 className="text-xl text-black font-bold mb-4">Settings</h2>

				<div className="flex space-x-2 justify-center">
					<select className="rounded-lg p-2" defaultValue={"plane"}>
						<option value="phone">Phone</option>
						<option value="plane">Plane</option>
						<option value="glasses">Glasses</option>
					</select>
					<select className="rounded-lg p-2" defaultValue={"chat-gpt"}>
						<option value="chat-gpt">Chat GTP</option>
						<option value="bard">Bard</option>
						<option value="google">Google</option>
					</select>
				</div>

				{variables.map((variable, index) => {
					console.log(variable);

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

				<button
					className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
					onClick={(event) => {
						console.log(variables);
					}}
				>
					Save Settings
				</button>
				<button className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
					Close
				</button>
			</div>
		</div>
	);
}
