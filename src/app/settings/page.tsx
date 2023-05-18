"use client";
import { Variable } from "@/types/variable";
import { useState } from "react";

export default function Home() {
	//const myArray: string[] = []; // array of variables
	const [variables, setVariables] = useState(Array<Variable>()); // setting array of variables as state
	//const els: HTMLElement[] = []; // array of variables
	//const [varInputs, setVarInputs] = useState(els); // setting array of variable inputs as state
	//const [firstVarInput, setFirstVarInput] = useState(""); // just for the first initial var input.
	//let [varNum, setVarNum] = useState(2); // for updating variable label names

	/* function saveVars() {
		const setTab = document.getElementById("settingstab") as HTMLInputElement;
		const children = setTab.children;

		// clear arrays then add all elements and values
		vars.splice(0, vars.length);
		varInputs.splice(0, varInputs.length);

		// add all current vars and elements to arrays (starting after first one)
		for (let i = 2; i < children.length; i++) {
			if (children[i] !== null) {
				const element = children[i] as HTMLElement;
				const newVarInput = element.querySelector("input");

				if (newVarInput !== null) {
					const variable = newVarInput.value;

					if (variable !== null) {
						vars.push(variable);
						varInputs.push(element);
					}
				}
			}
		}

		setVars(vars);
		setVarInputs(varInputs);

		// for setting first var
		const element = children[1] as HTMLInputElement;
		const newVarInput = element.querySelector("input");
		if (newVarInput !== null) {
			if (newVarInput.value !== null) {
				const variable = newVarInput.value;
				setFirstVarInput(variable);
			}
		}
	} */

	/* function addPlus() {
		// append new variable to settings tab
		const setTab = document.getElementById("settingstab") as HTMLInputElement;
		const varInput = document.getElementById("varInput") as HTMLInputElement;
		const newVar = varInput.cloneNode(true) as HTMLElement;
		const newVarLabel = newVar.querySelector("label");
		const newVarInput = newVar.querySelector("input");
		setTab.appendChild(newVar);

		// change new variable's label to correct number
		if (newVarLabel !== null) {
			newVarLabel.textContent = "Variable " + varNum;
			setVarNum(varNum + 1);
			console.log("Added: " + varNum);
		}

		// change newvars value to ""
		if (newVarInput !== null) {
			newVarInput.value = "";
		}
	} */

	function addPlus() {
		const newVariableName = (
			document.getElementById("variableName") as HTMLInputElement
		).value;

		const newVariable = new Variable(newVariableName, "");

		setVariables([...variables, newVariable]);
	}

	function removeVariable(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		const indexKey = event.currentTarget.id;
		const index = parseInt(indexKey.split("-")[1]);
		const div = document.getElementById(`var-${index}`) as HTMLDivElement;
		div.remove();

		console.log(index);

		const newVariables = [...variables];
		newVariables.splice(index, 1);
		setVariables(newVariables);
	}

	return (
		<main className="bg-gray-500">
			<div
				className="bg-gray-900 bg-opacity-50 flex items-center justify-center"
				id="settingstabparent"
			>
				<div className="bg-white p-8 rounded shadow-md" id="settingstab">
					<h2 className="text-xl text-black font-bold mb-4">Settings</h2>

					<div>
						<select className="rounded-lg p-2">
							<option value="phone">Phone</option>
							<option value="plane" selected>
								Plane
							</option>
							<option value="glasses">Glasses</option>
						</select>
					</div>

					{variables.map((variable, index) => {
						console.log(variable);
						
						return (
							<div id={`var-${index}`} className="pt-3" key={index}>
								<label
									htmlFor={`input-${index}`}
									className="block text-gray-700 font-bold mb-2"
									id={`label-${index}`}
								>
									{variable.getName()}
									<div
										id={`remove-${index}`}
										className="ml-1 font-bold text-2xl"
										onClick={(event) => {
											removeVariable(event);
										}}
									>
										-
									</div>
								</label>

								<input
									id={`input-${index}`}
									type="text"
									className="border border-gray-300 p-2 rounded-md"
									defaultValue={variable.getValue()}
									onChange={(event) => {
										variable.setValue(event.target.value);
									}}
								></input>
							</div>
						);
					})}

					<div className="mt-5">
						<p className="text-black font-semibold">Create new variable</p>
						<input
							id="variableName"
							type="text"
							className="border border-gray-300 p-2 rounded-md"
							placeholder="New Variable Name"
						/>
						<div
							className="flex w-8 h-8 bg-black mt-5 items-center"
							id="addBtn"
							onClick={addPlus}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="2"
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 6v12m6-6H6"
								/>
							</svg>
						</div>
					</div>

					<button
						className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
		</main>
	);
}
