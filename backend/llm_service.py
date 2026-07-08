import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_friendly_explanation(topic_name, rule_based_reason, career_goal, skill_level):
    try:
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=100,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"A learner with a '{career_goal}' career goal and '{skill_level}' skill level "
                        f"was recommended to study '{topic_name}'. "
                        f"The system's internal reason was: \"{rule_based_reason}\" "
                        f"Rewrite this as a short, encouraging, conversational explanation (2 sentences max) "
                        f"for the learner, in plain English. Do not mention 'the system' or 'rules'."
                    )
                }
            ]
        )
        return message.content[0].text.strip()
    except Exception as e:
        print(f"LLM call failed: {e}")
        return rule_based_reason