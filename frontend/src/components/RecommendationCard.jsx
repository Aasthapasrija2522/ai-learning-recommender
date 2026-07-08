function RecommendationCard({ recommendation, isCompleted, onToggle }) {
  const isHighPriority = recommendation.priority === "high";

  return (
    <div
      className={`p-4 rounded mb-3 border ${
        isHighPriority
          ? "bg-blue-50 border-blue-300"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(recommendation.topic_id, !isCompleted)}
          />

          <h3
            className={`font-semibold ${
              isCompleted ? "line-through text-gray-400" : ""
            }`}
          >
            {recommendation.topic_name}
          </h3>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            isHighPriority
              ? "bg-blue-600 text-white"
              : "bg-gray-400 text-white"
          }`}
        >
          {recommendation.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {recommendation.reason}
      </p>

      <a
        href={recommendation.resource_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline mt-2 inline-block"
      >
        View resource →
      </a>
    </div>
  );
}

export default RecommendationCard;
