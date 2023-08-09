import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const client = await clientPromise;
	const db = client.db("info-flow");
	const collection = db.collection("settings");

	const document = await collection.findOne({});

	if (!document) {
		return NextResponse.json({ error: "Settings not found" }, { status: 201 });
	}

	const settings = document;

	return NextResponse.json({ ...settings });
}

export async function POST(request: NextRequest) {
	const res = await request.json();

	if (!res) {
		return NextResponse.json({ error: "Data not found" }, { status: 400 });
	}

	const settings = res;

	if (!settings) {
		return NextResponse.json({ error: "Settings not found" }, { status: 400 });
	}

	const client = await clientPromise;
	const db = client.db("info-flow");
	const collection = db.collection("settings");

	try {
		collection.updateOne({}, { $set: { ...settings } }, { upsert: true });
		return NextResponse.json({ ...settings });
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
