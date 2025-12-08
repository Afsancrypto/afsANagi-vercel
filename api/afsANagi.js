// api/afsANagi.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { prompt } = req.body;

    // Replace YOUR_GEMINI_API_KEY with your actual key
    const GEMINI_API_KEY = "AIzaSyANomjvD-Dr_vnL0Kwf7Ky6XcC5LE0xCLU";

    // Call Gemini API
    const response = await fetch(
      "https://generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          maxOutputTokens: 256
        })
      }
    );

    const data = await response.json();

    // Extract model text safely
    const text = data?.candidates?.[0]?.content?.split("Flash modal")[0].trim() || "No response";

    res.status(200).json({ response: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
