import os
from dotenv import load_dotenv

load_dotenv()

# ── OpenRouter client (OpenAI-compatible) ─────────────────────────────────────

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL   = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free")

# Alias for router imports
GEMINI_FLASH_FREE = OPENROUTER_MODEL

# Only create the client if a real API key exists
_client = None
if OPENROUTER_API_KEY and OPENROUTER_API_KEY.strip() and not OPENROUTER_API_KEY.startswith("sk-or-v1-your"):
    try:
        from openai import OpenAI
        _client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url=OPENROUTER_BASE_URL,
        )
        print("[AI] OpenRouter client initialised.")
    except Exception as e:
        print(f"[AI] WARNING: Could not initialise OpenRouter client: {e}")
        _client = None
else:
    print("[AI] No OPENROUTER_API_KEY configured — AI explanations will be skipped.")


def chat_with_system(system_prompt: str, user_message: str, model: str = OPENROUTER_MODEL, api_key: str = None) -> str:
    """
    Send a chat request to OpenRouter and return the assistant's text reply.
    Falls back gracefully if the API key is not configured or the API is unavailable.
    """
    client = _client
    
    # If a custom API key is provided, instantiate a temporary client
    if api_key and api_key.strip():
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key.strip(), base_url=OPENROUTER_BASE_URL)
        except Exception as e:
            return f"[AI unavailable: {e}]"

    if client is None:
        return "[AI unavailable: OPENROUTER_API_KEY not configured]"

    try:
        response = client.chat.completions.create(
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
