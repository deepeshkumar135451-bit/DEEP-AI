
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage || !userMessage.trim()) {
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
Do not switch languages unless the user asks you to.`
    },
    {
        role: "user",
        content: userMessage
    }
]
