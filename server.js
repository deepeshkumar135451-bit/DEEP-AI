
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("."));

if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing!");
    process.exit(1);
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
            return res.status(400).json({
                reply: "Please enter a message."
            });
        }

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: `You are Deep AI, a friendly and helpful assistant.
Reply in the same language as the user's latest message.
If the user writes in Hindi, reply in natural Hindi.
If the user writes in Hinglish, reply in natural Hinglish.
If the user writes in English, reply in English.
Keep your answers clear, friendly, and easy to understand.
Explain things step by step when needed.
Do not switch languages unless the user asks you to.`
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        const reply =
            completion.choices[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        res.json({ reply });

    } catch (error) {
        console.error("Groq API Error:", error);

        res.status(500).json({
            reply: "Deep AI is having trouble responding. Please try again."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Deep AI server running on port ${PORT}`);
});
