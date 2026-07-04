from recommendation_data import TOPICS

def get_skill_level(score, total_questions):
    percentage = (score / total_questions) * 100
    if percentage < 40:
        return "beginner"
    elif percentage < 75:
        return "intermediate"
    else:
        return "advanced"


def generate_recommendations(career_goal, current_skills, score, total_questions):
    skill_level = get_skill_level(score, total_questions)

    difficulty_order = ["beginner", "intermediate", "advanced"]
    max_difficulty_index = difficulty_order.index(skill_level)
    allowed_difficulties = difficulty_order[:max_difficulty_index + 1]

    relevant_topics = [
        topic for topic in TOPICS
        if career_goal in topic["career_goals"] and topic["difficulty"] in allowed_difficulties
    ]

    current_skills_lower = [skill.lower() for skill in current_skills]
    recommendations = []

    for topic in relevant_topics:
        already_known = any(skill in topic["name"].lower() for skill in current_skills_lower)

        if already_known:
            reason = f"Skipped or lower priority: you already indicated knowledge of skills related to '{topic['name']}'."
            priority = "low"
        else:
            reason = (
                f"Recommended because it matches your career goal '{career_goal}', "
                f"and its difficulty ({topic['difficulty']}) fits your current skill level ({skill_level}) "
                f"based on your quiz score of {score}/{total_questions}."
            )
            priority = "high"

        recommendations.append({
            "topic_id": topic["id"],
            "topic_name": topic["name"],
            "difficulty": topic["difficulty"],
            "resource_url": topic["resource_url"],
            "reason": reason,
            "priority": priority
        })

    recommendations.sort(key=lambda r: r["priority"], reverse=True)

    return {
        "skill_level": skill_level,
        "recommendations": recommendations
    }