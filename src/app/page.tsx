"use client";
import { useState } from "react";

export default function Home() {
	const [popupVisible, setPopupVisible] = useState(false);
	const myArray: string[] = []; // array of variables
	const [vars, setVars] = useState(myArray); // setting array of variables as state
	const els: HTMLElement[] = []; // array of variables
	const [varInputs, setVarInputs] = useState(els); // setting array of variable inputs as state
	const [firstVarInput, setFirstVarInput] = useState(""); // just for the first initial var input.
	let [varNum, setVarNum] = useState(2); // for updating variable label names

	window.onload = function () {
		//console.log("Page has finished loading");
		//var setTab = document.getElementById("settingstabparent") as HTMLElement;

		// hiding setting tab when page is loaded...
		const setTab = document.querySelector('#settingstabparent') as HTMLElement;
		if (setTab !== null) {
			setTab.style.display = "none";
		}
	}

	function saveVars() {
		const setTab = document.getElementById("settingstab") as HTMLInputElement;
		const children = setTab.children;

		// clear arrays then add all elements and values
		vars.splice(0, vars.length);
		varInputs.splice(0, varInputs.length);

		// add all current vars and elements to arrays (starting after first one)
		for (let i = 2; i < children.length; i++) {
			if (children[i] !== null) {
				const element = children[i] as HTMLElement;
				const newVarInput = element.querySelector('input');

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
		const newVarInput = element.querySelector('input');
		if (newVarInput !== null) {
			if (newVarInput.value !== null) {
				const variable = newVarInput.value;
				setFirstVarInput(variable);
			}

		}

	}

	function togglePopup() {
		const setTabParent = document.getElementById("settingstabparent") as HTMLElement;

		// switching visibility of settings tab accordingly
		if (setTabParent.style.display == "none") {
			setTabParent.style.display = "block";
		}
		else {
			setTabParent.style.display = "none";
		}


		// showing divs upon opening settings
		if (setTabParent.style.display == "block") {

			console.log(vars);
			console.log(varInputs);

			const setTab = document.getElementById("settingstab") as HTMLElement;

			for (let i = 0; i < vars.length; i++) {
				if (vars[i] !== undefined) {
					setTab.appendChild(varInputs[i]);
				}

			}
		}

		const setTab = document.getElementById("settingstab") as HTMLInputElement;
		const children = setTab.children;

		for (let i = 2; i < children.length; i++) {
			if (children[i].querySelector('input') !== null) {
				const input = children[i].querySelector('input');
				if (input !== null) {
					if (input.value === "") {
						setTab.removeChild(children[i]);
						setVarNum(varNum - 1);
						console.log("Removed: "+ varNum);
					}
				}
			}
			
		}
	}

	function addPlus() {
		// append new variable to settings tab
		const setTab = document.getElementById("settingstab") as HTMLInputElement;
		const varInput = document.getElementById("varInput") as HTMLInputElement
		const newVar = varInput.cloneNode(true) as HTMLElement;
		const newVarLabel = newVar.querySelector('label');
		const newVarInput = newVar.querySelector('input');
		setTab.appendChild(newVar);

		// change new variable's label to correct number
		if (newVarLabel !== null) {
			newVarLabel.textContent = "Variable " + varNum;
			setVarNum(varNum + 1);
			console.log("Added: "+ varNum);
		}

		// change newvars value to ""
		if (newVarInput !== null) {
			newVarInput.value = "";
		}
	}

	return (
		<main>
			<div className="h-full flex-grow bg-gray-100">
				<nav className="bg-gray-800 py-2">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<div className="text-gray-300 font-bold">My Website</div>
						<form className="flex">
							<input
								className="rounded-l-lg bg-gray-800 text-gray-100 border-none w-64 px-4 leading-tight focus:outline-none"
								type="text"
								placeholder="Search..."
							></input>
							<button className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400">
								Search
							</button>
						</form>
					</div>
				</nav>
				<div className="flex flex-row-reverse">
					<div className="w-1/5 bg-gray-200 py-4 px-6">
						<h2 className="text-gray-800 font-bold mb-4">Conversations</h2>
						<ul className="text-gray-700">
							<li className="mb-4">
								<a href="#" className="text-blue-500 hover:text-blue-700">
									Conversation 1
								</a>
							</li>
							<li className="mb-4">
								<a href="#" className="text-blue-500 hover:text-blue-700">
									Conversation 2
								</a>
							</li>
							<li className="mb-4">
								<a href="#" className="text-blue-500 hover:text-blue-700">
									Conversation 3
								</a>
							</li>
							<li className="mb-4">
								<a href="#" className="text-blue-500 hover:text-blue-700">
									Conversation 4
								</a>
							</li>
							<li className="mb-4">
								<a href="#" className="text-blue-500 hover:text-blue-700">
									Conversation 5
								</a>
							</li>
						</ul>
					</div>
					<div className="flex-grow bg-white p-6">
						<h1 className="text-gray-900 text-3xl font-bold mb-4">Welcome to my website!</h1>
						<p className="text-gray-700">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac
							tincidunt eros, vel ullamcorper tellus. Integer vestibulum
							tincidunt lacus, sit amet viverra neque bibendum vel. Duis vel
							lorem tincidunt, maximus velit vitae, cursus nibh. Fusce auctor,
							augue eu varius eleifend, erat ante bibendum mauris, nec malesuada
							quam libero id odio. Sed volutpat velit nec nulla dictum
							convallis.
						</p>

					</div>
					<div className="bg-white rounded-lg shadow-lg p-6">
						<div onClick={togglePopup} id="settings-icon" className="bg-white rounded-lg shadow p-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="black">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div>


				<div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" id="settingstabparent">
					<div className="bg-white p-8 rounded shadow-md" id="settingstab">
						<h2 className="text-xl text-black font-bold mb-4">Settings</h2>

						<div id="varInput" className="pt-3">
							<label htmlFor="input" className="block text-gray-700 font-bold mb-2" id="varLabel">Variable 1</label>
							<input id="input" type="text" className="border border-gray-300 p-2 rounded-md" defaultValue={firstVarInput}></input>
						</div>

						<div className="flex w-8 h-8 bg-black mt-5 items-center" id="addBtn" onClick={addPlus}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
							</svg>
						</div>



						<button className="block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={saveVars}>
							Save Settings
						</button>
						<button className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
							onClick={togglePopup}>
							Close
						</button>
					</div>
				</div>

			</div>

		</main>


	);
}
