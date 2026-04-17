'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    
    // Prepare data - ensure no undefined values
    const insertData = {
      email: email,
      carbon_score: carbonScore,
      home_size: userData?.homeSize || null,
      electricity_usage: userData?.electricity || null,
      miles_per_week: userData?.miles || null
    };
    
    console.log('Sending to Supabase:', insertData);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(insertData)
      .select();
    
    setSaving(false);
    
    if (error) {
      console.error('Supabase error:', error);
      setErrorMsg(error.message);
      alert('Error: ' + error.message);
    } else if (data && data[0]) {
      console.log('Saved successfully:', data[0]);
      setLeadId(data[0].id);
      setSubmitted(true);
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
    console.log(`Affiliate click: ${buttonType}, Lead: ${leadId}`);
  };

  const affiliateLinks = {
    solar: 'https://www.energysage.com/solar/carbon-offset/',
    products: 'https://earthhero.com/',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-left">
      <h2 className="text-2xl font-bold text-emerald-800 mb-4">Your Carbon Footprint</h2>
      
      <div className="text-4xl font-bold text-emerald-600 mb-2">
        {carbonScore.toFixed(2)} tons/year
      </div>
      
      <p className="text-gray-600 mb-6">
        {carbonScore > 10 
          ? "🚨 High impact - Solar panels could cut this by 40%" 
          : carbonScore > 5 
          ? "⚠️ Moderate impact - Small changes help" 
          : "✅ Low impact - Great job!"}
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          Error: {errorMsg}
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleEmailSubmit} className="mb-6 p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800 mb-2 font-semibold">
            Get your personalized reduction plan
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Send My Plan'}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-green-100 rounded-lg text-center">
          <p className="text-green-800 font-semibold">✅ Success! Check your inbox!</p>
          <p className="text-green-600 text-sm mt-2">Now explore options below:</p>
        </div>
      )}

      <div className="space-y-3">
        <a 
          href={affiliateLinks.solar}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('solar')}
          className="block w-full bg-amber-500 text-white p-4 rounded-lg hover:bg-amber-600 text-center font-bold shadow-md"
        >
          ☀️ Get Free Solar Estimate<br />
          <span className="text-sm font-normal">Save $1,200/year • No obligation</span>
        </a>

        <a 
          href={affiliateLinks.products}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('products')}
          className="block w-full bg-emerald-600 text-white p-4 rounded-lg hover:bg-emerald-700 text-center font-bold shadow-md"
        >
          🛒 Shop Carbon-Neutral Products<br />
          <span className="text-sm font-normal">Verified sustainable brands</span>
        </a>
      </div>

      <button 
        onClick={onRestart}
        className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm"
      >
        ← Calculate again
      </button>
    </div>
  );
}