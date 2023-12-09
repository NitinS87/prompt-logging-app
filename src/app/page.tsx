import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-24 gap-10">
      <h2 className="text-4xl">Prompt Logging App</h2>
      <div className="flex flex-col justify-between gap-2 text-center">
        <span>Head over to chat section to for prompts</span>
        <span>Head over to dashboard section for current logs</span>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Link
          href="/chat"
          className="bg-white text-black px-4 py-2 shadow-md rounded-md hover:bg-black hover:text-white hover:border-white border-transparent border transition-colors duration-200 ease-in-out hover:underline"
        >
          Chat
        </Link>
        <Link
          href="dashboard"
          className="bg-white text-black px-4 py-2 shadow-md rounded-md hover:bg-black hover:text-white hover:border-white border-transparent border transition-colors duration-200 ease-in-out hover:underline"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
