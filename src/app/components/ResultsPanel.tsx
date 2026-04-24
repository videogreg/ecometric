'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ComparisonChart from './ComparisonChart';

type ResultsPanelProps = {
  carbonScore: number;
  onRestart: () => void;
  userData?: {
    homeSize?: number;
    electricity?: number;
    miles?: number;
  };
};

export default function ResultsPanel({ carbonScore, onRestart, userData }: ResultsPanelProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showShare, setShowShare] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    
    const insertData = {
      email: email,
      carbon_score: carbonScore,
      home_size: userData?.homeSize || null,
      electricity_usage: userData?.electricity || null,
      miles_per_week: userData?.miles || null
    };
    
    const { data, error } = await supabase
      .from('leads')
      .insert(insertData)
      .select();
    
    setSaving(false);
    
    if (error) {
      setErrorMsg(error.message);
    } else if (data && data[0]) {
      setLeadId(data[0].id);
      setSubmitted(true);
      // Auto-send report simulation (we'll add SendGrid next)
      console.log('Would send email to:', email);
    }
  };

  const trackClick = async (buttonType: 'solar' | 'products') => {
    if (leadId) {
      await supabase.from('clicks').insert({
        lead_id: leadId,
        button_type: buttonType,
        revenue_potential: buttonType === 'solar' ? 75 : 25
      });
    }
  };

  const shareText = `I just calculated my carbon footprint: ${carbonScore.toFixed(1)} tonnes/year. The average North American produces 16 tonnes! Calculate yours at ecometric-carbon-calc.netlify.app #carbonfootprint #sustainability`;

  const affiliateLinks = {
    solar: 'https://www.energysage.com/solar/carbon-offset/',
    products: 'https://earthhero.com/',
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-lg mx-auto text-left border border-emerald-100">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 bg-emerald-100 rounded-full text-emerald-700 text-sm font-semibold mb-2">
          Results Ready
        </div>
        <h2 className="text-3xl font-bold text-emerald-900">Your Carbon Footprint</h2>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-emerald-600 mb-1">
          {carbonScore.toFixed(2)}
        </div>
        <div className="text-gray-500 text-sm">tonnes CO2 / year</div>
      </div>
      
      <ComparisonChart userScore={carbonScore} />
      
      <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
        <p className="text-amber-800 text-sm">
          <strong>💡 Did you know?</strong> Reducing by just 2 tonnes saves ~$1,200/year in energy costs.
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          Error: {errorMsg}
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleEmailSubmit} className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
          <p className="text-emerald-800 font-bold mb-2">
            📧 Get Your Personalized Reduction Plan
          </p>
          <p className="text-emerald-600 text-sm mb-3">
            We'll email you 3 custom actions based on your {carbonScore.toFixed(1)} tonne score
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-emerald-300 rounded-lg mb-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 font-semibold shadow-md transition"
          >
            {saving ? 'Generating Your Plan...' : 'Send My Free Plan'}
          </button>
        </form>
      ) : (
        <div className="mt-6 p-5 bg-green-100 rounded-xl text-center border border-green-300">
          <p className="text-green-800 font-bold text-lg">✅ Plan Generated!</p>
          <p className="text-green-700 text-sm mt-1">
            Check <strong>ecomcip@gmail.com</strong> in 2-3 minutes
          </p>
          <p className="text-green-600 text-xs mt-2">
            (Don't forget to check spam folder)
          </p>
        </div>
      )}

      {/* Social Sharing */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => setShowShare(!showShare)}
          className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold"
        >
          {showShare ? 'Hide Sharing' : '📤 Share Your Results'}
        </button>
        
        {showShare && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Copy and share:</p>
            <textarea 
              readOnly 
              value={shareText}
              className="w-full p-2 text-xs bg-white border rounded resize-none h-20"
            />
            <div className="flex gap-2 mt-2 justify-center">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Tweet
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=https://ecometric-carbon-calc.netlify.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-800"
              >
                Facebook
              </a>
              <button 
                onClick={() => navigator.clipboard.writeText(shareText)}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Affiliate Revenue Buttons */}
      <div className="mt-6 space-y-3">
        <a 
          href={affiliateLinks.solar}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('solar')}
          className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl hover:from-amber-600 hover:to-orange-600 text-center font-bold shadow-lg transform hover:scale-[1.02] transition"
        >
          <div className="text-lg">☀️ Get Free Solar Estimate</div>
          <div className="text-sm font-normal opacity-90">Save $1,200/year • No obligation • 2-min quote</div>
        </a>

        <a 
          href={affiliateLinks.products}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('products')}
          className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 text-center font-bold shadow-lg transform hover:scale-[1.02] transition"
        >
          <div className="text-lg">🛒 Shop Carbon-Neutral Products</div>
          <div className="text-sm font-normal opacity-90">Verified sustainable brands • Free shipping over $50</div>
        </a>
      </div>

      <button 
        onClick={onRestart}
        className="w-full mt-6 text-gray-400 hover:text-gray-600 text-sm py-2"
      >
        ← Calculate again
      </button>
    </div>
  );
}