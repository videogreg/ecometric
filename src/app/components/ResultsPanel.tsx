'use client';
import { useState } from 'react';

type ResultsPanelProps = {
  carbonScore: number;
  onRestart: () => void;
};

export default function ResultsPanel({ carbonScore, onRestart }: ResultsPanelProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store email (we'll connect to Supabase later)
    console.log('Email captured:', email);
    setSubmitted(true);
  };

  // Affiliate links (replace with your real IDs when approved)
  const affiliateLinks = {
    solar: 'https://www.energysage.com/solar/carbon-offset/?rc=YOUR_ID',
    products: 'https://earthhero.com/?ref=YOUR_ID',
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

      {/* Email Capture */}
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
            className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
          >
            Send My Plan
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-green-100 rounded-lg text-center">
          <p className="text-green-800 font-semibold">✅ Check your inbox!</p>
        </div>
      )}

      {/* Affiliate Revenue Buttons */}
      <div className="space-y-3">
        <a 
          href={affiliateLinks.solar}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-amber-500 text-white p-4 rounded-lg hover:bg-amber-600 text-center font-bold shadow-md"
          onClick={() => console.log('Solar affiliate clicked')}
        >
          ☀️ Get Free Solar Estimate<br />
          <span className="text-sm font-normal">Save $1,200/year • No obligation</span>
        </a>

        <a 
          href={affiliateLinks.products}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-emerald-600 text-white p-4 rounded-lg hover:bg-emerald-700 text-center font-bold shadow-md"
          onClick={() => console.log('Products affiliate clicked')}
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