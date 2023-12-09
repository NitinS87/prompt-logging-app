"use client";
import CustomDropdown from "@/components/CustomDropdown";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

export interface Message {
  content: string;
  timestamp: string;
  role: "assistant" | "system";
}

const Chat = () => {
  const [name, setName] = useState<string>(localStorage.getItem("name") || "");
  const [messages, setMessages] = useState<Message[]>(
    JSON.parse(localStorage.getItem("messages") || "[]")
  );
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>("gpt-3-turbo");

  const handleModelChange = (selectedModel: string) => {
    setModel(selectedModel);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() === "") return;
    const timestamp = new Date().toLocaleTimeString();
    const data: Message[] = [
      ...messages,
      { content: input, timestamp, role: "system" },
    ];
    setMessages(data);
    // console.log(data);

    const body = {
      user: name,
      model: model,
      messages: data,
    };

    await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setMessages(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setInput("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleClear = () => {
    setName("");
    setMessages([]);
    setInput("");
  };

  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [name, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="w-full md:w-[80%] lg:w-[60%] flex flex-col justify-between gap-4 min-h-screen mx-auto overflow-hidden p-2">
      <Link href="/" className="text-2xl px-4">
        &#8592;
      </Link>
      <div className="w-full h-[80vh] overflow-auto px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <h2 className="text-2xl font-bold text-gray-700">
              Welcome to our chat!
            </h2>
            <p className="text-gray-500 text-center">
              Enter your name to get started. <br /> Start a conversation with
              our assistant by typing a message below.
            </p>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className="p-2 rounded-md border-gray-300 outline-none bg-slate-800"
            />
            <CustomDropdown
              options={["gpt-3-turbo", "gpt-4"]}
              optionsClass="p-2 rounded-md border-gray-300 outline-none bg-slate-800 w-48"
              className="p-2 rounded-md border-gray-300 outline-none bg-slate-800 w-48"
              handleChange={handleModelChange}
            />
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="flex flex-col justify-between gap-2">
              <div className="border-gray-200 border p-3 rounded-md shadow-md">
                <Markdown className="prose text-white">{message.content}</Markdown>
              </div>
              <p
                className={`text-sm text-gray-500 ${
                  message.role === "assistant" ? "mr-auto" : "ml-auto"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mb-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-grow p-2 rounded-md border-gray-300 bg-slate-800 outline-none disabled:cursor-not-allowed"
          disabled={!name}
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md disabled:cursor-not-allowed"
          disabled={!name}
        >
          Send
        </button>
        <button
          type="button"
          className="py-2 px-4 bg-gray-500 text-white rounded-md disabled:cursor-not-allowed"
          onClick={handleClear}
          disabled={!name}
        >
          Clear
        </button>
      </form>
    </main>
  );
};

export default Chat;
