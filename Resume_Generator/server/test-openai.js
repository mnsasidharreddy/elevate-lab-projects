import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });
console.log("API KEY:", process.env.OPENAI_API_KEY?.slice(0,10) + "...");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function run() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You name is coco." },
        { role: "user", content: "Introduce yourself." }
      ]
    });
    
    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI error:", err);
  }
}

run();
