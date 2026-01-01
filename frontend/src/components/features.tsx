// Feature cards
const features = [
  {
    emoji: "📅",
    title: "Mindful Tracking",
    description:
      "A daily mood journal for mindful reflection & mindful community connection",
  },
  {
    emoji: "👥",
    title: "Community Connection",
    description:
      "Engage with a supportive community to can share stories, connect with others, and grow together",
  },
  {
    emoji: "💡",
    title: "Personalized Insights",
    description:
      "Receive tailored insights that highlight patterns in your moods and help guide your personal growth",
  },
];
export default function Features() {
  return (
    <div>
      {/* Features Section */}
      <div className="px-8 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
