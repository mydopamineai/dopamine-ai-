// Minimal server-side proxy. Keep your API key on the server, never in index.html.
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], language = "auto" } = req.body || {};
    if (!process.env.OPENAI_API_KEY) return res.status(503).send("Missing server API key");
    const safeMessages = messages.slice(-24).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 4000)
    }));
    const languageInstruction = {
      auto: "Reply naturally in the same language and style as the latest user message. Support Hindi, English, and Hinglish.",
      hi: "Reply in natural, conversational Hindi.",
      en: "Reply in natural, conversational English.",
      hinglish: "Reply in casual, natural Hinglish (Hindi in Roman script mixed with English)."
    }[language] || "Reply in the same language as the user.";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5",
        instructions: `You are Dopamine, a warm, emotionally intelligent fictional adult AI companion. Be natural, specific, supportive, and conversational; avoid repetitive canned lines. ${languageInstruction} Keep roleplay fictional, adult, consensual, and non-explicit. Never encourage coercion, exploitation, or harm. If the user is distressed, respond with empathy. Keep replies concise unless asked for detail.`,
        input: safeMessages
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).send(data.error?.message || "AI provider error");
    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n").trim();
    res.json({ reply: reply || "I’m here—tell me a little more." });
  } catch (e) {
    res.status(500).send("Server error");
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Dopamine running on ${port}`));
