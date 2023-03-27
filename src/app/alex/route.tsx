export async function GET(request: Request) { 
    return new Response("Hello GET World");
}

export async function POST(request: Request) { 
    return new Response("Hello POST World");
}
