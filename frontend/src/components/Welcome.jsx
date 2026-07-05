function Welcome({ name }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-600">Welcome, {name}!</h1>
      <p className="text-gray-600 mt-2">Let's build your personalized learning roadmap.</p>
    </div>
  );
}

export default Welcome;