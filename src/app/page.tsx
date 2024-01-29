"use client";
import { useEffect, useState } from "react";
import { sendApiRequest } from "./services/apiService";

export default function Home() {
  // Store conversation in state
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  // Loading state
  const [loading, setLoading] = useState(false);

  // Get AI response
  const getResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    // Avoid default form submission behaviour upon submission
    e.preventDefault();
    // AI endpoint
    let endpoint = "/api/get-ai-response";
    // User message text
    const userText = (e.target as HTMLFormElement).elements.namedItem(
      "message"
    ) as HTMLInputElement | null;
    let userMessage = userText?.value ?? "";
    // Body for request
    let body = { message: userMessage };
    // Store the user message
    setMessages((a) => [...a, { role: "user", text: userMessage }]);
    // Enable loading to show loader
    setLoading(true);
    // Empty the input element
    userText && (userText.value = "");
    // Get response from AI (takes time)
    const botText = await sendApiRequest(endpoint, body);
    // After getting response disable loader again
    setLoading(false);
    // Store the bot response
    setMessages((a) => [...a, { role: "bot", text: botText }]);
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);
  return (
    <main>
      <div className="h-screen flex flex-col justify-center items-center gap-y-4 p-6">
        <div className="text-center text-4xl">AI Chat Bot</div>
        <div className="max-w-4xl mx-4 max-h-[70vh] w-full rounded-lg border-[1px] border-solid border-gray-500">
          <div className="flex flex-col h-full">
            <div className="h-full p-3 overflow-auto">
              <div className="flex flex-col gap-y-4">
                {messages.map((message, index) =>
                  message.role == "user" ? (
                    <div key={index} className="flex gap-x-3">
                      <div className="shrink-0">
                        <img className="w-[40px]" src="./user.svg" />
                      </div>
                      <div className="leading-[1.4]">
                        <div className="font-bold">YOU</div>
                        <div>{message.text}</div>
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="flex gap-x-3">
                      <div className="shrink-0">
                        <img className="w-[40px]" src="./bot.svg" />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <div className="font-bold">CHATBOT</div>
                        <div
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
                <div className={`flex gap-x-3 ${!loading ? "hidden" : ""}`}>
                  <div className="shrink-0">
                    <img className="w-[40px]" src="./bot.svg" />
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <div className="font-bold">CHATBOT</div>
                    <div>
                      <span className="flex h-6 w-6 relative items-center justify-center">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative rounded-full h-5 w-5 bg-sky-500"></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-[1px] border-solid border-gray-500">
              <form
                className="flex flex-col md:flex-row p-3 gap-x-5 gap-y-4 w-full"
                onSubmit={getResponse}
              >
                <input
                  className="w-full border-[1px] border-solid border-gray-500 p-2 text-md rounded-lg"
                  name="message"
                  type="text"
                  placeholder="Type your message here..."
                  required
                />
                <button
                  type="submit"
                  className="w-full p-2 md:w-1/5 bg-pink-800 text-white rounded-xl"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
