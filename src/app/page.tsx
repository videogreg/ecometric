import CarbonCalculator from './components/CarbonCalculator';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-sm mb-4 border border-emerald-500/30">
            🌍 12,847 footprints calculated this month
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            EcoMetric
          </h1>
          <p className="text-xl text-emerald-200 mb-2">
            Carbon Intelligence Platform
          </p>
          <p className="text-emerald-400/80 text-sm max-w-md mx-auto">
            Join 50,000+ North Americans tracking their impact and saving money with sustainable choices
          </p>
        </div>
        
        <CarbonCalculator />
        
        <div className="mt-8 flex gap-4">
          <Link 
            href="/blog" 
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-emerald-100 hover:bg-white/20 transition border border-white/20"
          >
            📚 Sustainability Blog
          </Link>
          <Link 
            href="/leaderboard" 
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-emerald-100 hover:bg-white/20 transition border border-white/20"
          >
            🏆 Community Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}