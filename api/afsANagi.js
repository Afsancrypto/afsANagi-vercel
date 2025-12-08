export default async function handler(req, res) {
  // CORS headers for Blogger front-end
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt } = req.body;

    // Gemini API call
    const response = await fetch('https://generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 500
      })
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content || "No response from Gemini API";

    res.status(200).json({ response: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
