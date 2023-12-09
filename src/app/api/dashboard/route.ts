export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const { page, limit } = Object.fromEntries(searchParams.entries());
  //   console.log(page, limit);
  const body = await req.json();
  //   console.log(body);
  if (body !== null && body.latency !== undefined) {
    if (body.latency === 0) body.latency = "";
    else body.latency = body.latency.toString();
  }

  const res = await fetch(
    `http://localhost:8000/dashboard/getData?page=${page}&limit=${limit}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  const result = data;

  //   console.log("final data", result);

  return Response.json(result);
}
