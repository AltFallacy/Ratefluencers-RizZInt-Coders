import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# ── OpenRouter client (OpenAI-compatible) ─────────────────────────────────────

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL   = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free")

# Alias for router imports
GEMINI_FLASH_FREE = OPENROUTER_MODEL

_client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
)


def chat_with_system(system_prompt: str, user_message: str, model: str = OPENROUTER_MODEL) -> str:
    """
    Send a chat request to OpenRouter and return the assistant's text reply.
    Falls back to a descriptive error string if the API is unavailable.
    """
    try:
        response = _client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message},
            ],
            max_tokens=512,
            temperature=0.7,
        )
        return response.choices[0].message.content or ""
    except Exception as exc:
        return f"[AI unavailable: {exc}]"
