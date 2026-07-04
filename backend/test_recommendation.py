from recommendation_engine import generate_recommendations

result = generate_recommendations(
    career_goal="Backend Developer",
    current_skills=["python", "sql"],
    score=1,
    total_questions=5
)

print(f"Skill level: {result['skill_level']}\n")

for rec in result["recommendations"]:
    print(f"- {rec['topic_name']} ({rec['difficulty']}) [{rec['priority']} priority]")
    print(f"  Reason: {rec['reason']}")
    print(f"  Resource: {rec['resource_url']}\n")