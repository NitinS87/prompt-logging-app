export async function POST(req: Request) {
  const body = await req.json();
  const messagesWithoutTimestamp = body.messages.map((item: any) => {
    const { timestamp, ...rest } = item;
    return rest;
  });

  // console.log("body sent", body);

  const res = await fetch("http://localhost:8000/chat/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: body.user,
      messages: messagesWithoutTimestamp,
      model: body.model,
    }),
  });

  const data = await res.json();

  // console.log("res data", data);
  // console.log(messagesWithoutTimestamp);

  const result = [
    ...body.messages,
    {
      content: data.choices[0].message.content,
      timestamp: new Date().toLocaleTimeString(),
      role: "assistant",
    },
  ];

  // console.log("final data", result);

  return Response.json(result);
}
