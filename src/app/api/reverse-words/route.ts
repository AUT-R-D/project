export async function POST(request: Request) {
	const { inputText } = await request.json();
	const reversed = inputText.split(" ").reverse().join(" ");
	return new Response(JSON.stringify({outputText: reversed}), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
