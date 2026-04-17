import CarbonCalculator from './components/CarbonCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4">EcoMetric</h1>
        <p className="text-xl text-emerald-600 mb-8">Carbon Intelligence Platform</p>
        <CarbonCalculator />
      </div>
    </main>
  );
}