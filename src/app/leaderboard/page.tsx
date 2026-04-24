import fs from 'fs';
import path from 'path';
import Link from 'next/link';

type Lead = {
  email: string;
  carbon_score: number;
  created_at: string;
};

export default function LeaderboardPage() {
  // Read from local JSON file instead of Supabase (static export compatible)
  const dataPath = path.join(process.cwd(), 'content', 'leads.json');
  let topUsers: Lead[] = [];
  
  try {
    if (fs.existsSync(dataPath)) {
      topUsers = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch {
    topUsers = [];
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">🏆 EcoMetric Leaderboard</h1>
        <p className="text-emerald-300 text-center mb-8">Lowest carbon footprints this month</p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {topUsers.length > 0 ? (
            <div className="space-y-3">
              {topUsers.map((user: Lead, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                    index === 1 ? 'bg-gray-300/20 border border-gray-300/30' :
                    index === 2 ? 'bg-amber-600/20 border border-amber-600/30' :
                    'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {user.email.split('@')[0]}@***
                      </div>
                      <div className="text-emerald-300 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">
                      {user.carbon_score?.toFixed(1)}
                    </div>
                    <div className="text-emerald-500 text-xs">tonnes/yr</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-emerald-300 py-8">No entries yet. Be the first!</p>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-emerald-100 hover:bg-white/20 transition border border-white/20"
          >
            ← Calculate Your Footprint
          </Link>
        </div>
      </div>
    </main>
  );
}