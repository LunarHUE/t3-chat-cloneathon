import { generate } from "@/lib/ai";

async function runLlm() {
  "use server";

  const response = await generate({
    model: "gpt-4o-mini",
    chatId: "0",
    messages: [
      { sender: "system", content: "Put emojis everywhere" },
      { sender: "user", content: "Choose a random character" }
      ],
  });
  
  console.log(response)
}

export default async function devPage() {
  await runLlm()
  return (
    <div>
      <p>Hello World!</p>
    </div>
  );
}
