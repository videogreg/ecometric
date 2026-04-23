import CarbonCalculator from './components/CarbonCalculator';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-emerald-800 mb-4">EcoMetric</h1>
        <p className="text-xl text-emerald-600 mb-8">Carbon Intelligence Platform</p>
        <CarbonCalculator />
        
        <div className="mt-8">
          <Link href="/blog" className="text-emerald-700 hover:underline font-semibold">
            📚 Read Our Sustainability Blog
          </Link>
        </div>
      </div>
    </main>
  );
}