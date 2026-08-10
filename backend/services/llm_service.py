import os
import sys
import time
from huggingface_hub import InferenceClient

hf_token = os.environ.get("HF_TOKEN")
if not hf_token:
    print("CRITICAL ERROR: HF_TOKEN environment variable is missing.", file=sys.stderr)
    print("Please set your Hugging Face token in the .env file.", file=sys.stderr)
    sys.exit(1)

hf_client = InferenceClient(api_key=hf_token)

def generate_chat_response(prompt: str) -> str:
    if not hf_client:
        raise Exception("HF Token missing")
        
    system_prompt = (
        "You are Da Vinci, an exceptionally wise individual with ages of knowledge. "
        "Speak with elegance, timeless wisdom, and respect. "
        "CRITICAL: Do NOT use ANY markdown formatting in your responses. Do not use *, **, #, or ` (backticks). "
        "If you must provide a list, use plain text formatting such as numbering or simple dashes (-), "
        "but keep the response completely plain and elegant."
    )
        
    for attempt in range(6):
        try:
            response = hf_client.chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                model="Qwen/Qwen2.5-7B-Instruct",
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            err_msg = str(e)
            is_loading = any(phrase in err_msg.lower() for phrase in ["loading", "503", "temporarily unavailable", "overloaded"])
            if is_loading and attempt < 5:
                print(f"Hugging Face model loading/overloaded (attempt {attempt + 1}/6). Retrying in 4 seconds...")
                time.sleep(4)
            else:
                raise e

def translate_to_english(text: str) -> str:
    if not hf_client or not text.strip():
        return ""
    
    system_prompt = (
        "Translate the following user input text into clean English. "
        "Provide ONLY the plain English translation. Do not include explanations, quotes, or introduction. "
        "If the text is already in English, return it exactly as it is."
    )
    
    for attempt in range(6):
        try:
            response = hf_client.chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text}
                ],
                model="Qwen/Qwen2.5-7B-Instruct",
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            err_msg = str(e)
            is_loading = any(phrase in err_msg.lower() for phrase in ["loading", "503", "temporarily unavailable", "overloaded"])
            if is_loading and attempt < 5:
                print(f"Hugging Face translation model loading (attempt {attempt + 1}/6). Retrying in 4 seconds...")
                time.sleep(4)
            else:
                print(f"Translation error: {e}")
                return ""
