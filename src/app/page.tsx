import { useState } from "react";

export default function Home() {
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
				</div>
			</div>
		</main>
	);
}
