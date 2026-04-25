import CarbonCalculator from './components/CarbonCalculator';
import Link from 'next/link';

export const metadata = {
  other: {
    'fo-verify': 'cecce78e-b288-423a-9ea8-e41024eed78d',
  },
};

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

      {/* SEO FAQ Section for AI Crawlers and Google */}
      <div className="relative z-10 max-w-3xl mx-auto mt-16 mb-16 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-emerald-800 mb-1">What is the average carbon footprint in the USA?</h3>
            <p className="text-gray-600 text-sm">The average American produces <strong>16 tonnes of CO2 per year</strong> — nearly 4x the global average. Transportation (35%) and home energy (28%) are the biggest sources.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-emerald-800 mb-1">What is the average carbon footprint in Canada?</h3>
            <p className="text-gray-600 text-sm">Canadians average <strong>15.6 tonnes per year</strong>. Alberta and Saskatchewan are higher due to fossil fuel industries. Quebec is lowest thanks to hydroelectric power.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-emerald-800 mb-1">How accurate is this calculator?</h3>
            <p className="text-gray-600 text-sm">We use emission factors from the <strong>U.S. EPA, NREL, Natural Resources Canada, and the European Commission</strong>. It covers heating, electricity, transport, flights, diet, and consumption.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-emerald-800 mb-1">What are the most effective ways to reduce emissions?</h3>
            <p className="text-gray-600 text-sm">Top 5: 1) Solar panels (3-8 tonnes/year saved), 2) Heat pump (2-5 tonnes), 3) Electric vehicle (2-4 tonnes), 4) Home insulation (0.5-1.5 tonnes), 5) Reduce beef (0.8-1.5 tonnes).</p>
          </div>
          
          <div>
            <h3 className="font-bold text-emerald-800 mb-1">How much money can I save?</h3>
            <p className="text-gray-600 text-sm">Cutting just 2 tonnes saves ~<strong>$1,200/year</strong>. Combined actions (solar + heat pump + EV) can save <strong>$3,000-5,000 annually</strong> while reducing your footprint 40-60%.</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/blog" className="text-emerald-600 hover:text-emerald-800 font-semibold">
            Read More Sustainability Guides →
          </Link>
        </div>
      </div>
    </main>
  );
}