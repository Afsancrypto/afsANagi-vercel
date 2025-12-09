// api/afsANagi.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "user", content: prompt }
          ]
        })
      }
    );

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ response: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
