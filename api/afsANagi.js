# api/afsANagi.py
import os
from openai import OpenAI
from flask import Flask, request, jsonify

app = Flask(__name__)

client = OpenAI(
    base_url="https://router.huggingface.co/v1",  # Hugging Face OpenAI-compatible router
    api_key=os.environ.get("HF_TOKEN")             # Set HF_TOKEN in Vercel Environment
)

@app.route("/", methods=["POST"])
def afsanagi():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt required"}), 400

    try:
        completion = client.chat.completions.create(
            model="moonshotai/Kimi-K2-Instruct-0905",
            messages=[{"role": "user", "content": prompt}]
        )
        text = completion.choices[0].message["content"]
        return jsonify({"response": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# For local testing
if __name__ == "__main__":
    app.run(debug=True)
