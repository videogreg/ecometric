export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4">EcoMetric</h1>
        <p className="text-xl text-emerald-600 mb-8">Carbon Intelligence Platform</p>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <p className="text-gray-600 mb-4">🌱 Calculating your impact...</p>
          <p className="text-sm text-gray-400">Launching May 2025</p>
        </div>
      </div>
    </main>
  );
}