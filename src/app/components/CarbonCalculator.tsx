'use client';
import { useState } from 'react';

export default function CarbonCalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [result, setResult] = useState(null);

  const calculateFootprint = () => {
    // Simple carbon calculation formula
    const homeEmissions = (data.homeSize || 1000) * 0.003;
    const energyEmissions = (data.electricity || 500) * 0.0004;
    const carEmissions = (data.miles || 100) * 0.0004;
    const total = homeEmissions + energyEmissions + carEmissions;
    return total.toFixed(2);
  };

  const handleNext = (newData) => {
    setData({...data, ...newData});
    if (step < 3) {
      setStep(step + 1);
    } else {
      const score = calculateFootprint();
      setResult(score);
    }
  };

  if (result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-left">
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Your Carbon Footprint</h2>
        <div className="text-4xl font-bold text-emerald-600 mb-2">{result} tons/year</div>
        <p className="text-gray-600 mb-6">
          {result > 10 ? "🚨 High impact - Solar panels could cut this by 40%" : 
           result > 5 ? "⚠️ Moderate impact - Small changes help" : 
           "✅ Low impact - Great job!"}
        </p>
        
        <div className="space-y-3">
          <button className="w-full bg-emerald-600 text-white p-3 rounded hover:bg-emerald-700">
            Get Free Solar Estimate (Save $1,200/year)
          </button>
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Shop Carbon-Neutral Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-left">
      {step === 1 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Step 1: Home Size</h3>
          <p className="mb-2">Square feet:</p>
          <select className="w-full p-2 border rounded mb-4" onChange={(e) => handleNext({homeSize: e.target.value})}>
            <option value="">Select...</option>
            <option value="500">Small (500 sq ft)</option>
            <option value="1000">Medium (1,000 sq ft)</option>
            <option value="2000">Large (2,000+ sq ft)</option>
          </select>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Step 2: Monthly Electricity</h3>
          <p className="mb-2">kWh per month:</p>
          <select className="w-full p-2 border rounded mb-4" onChange={(e) => handleNext({electricity: e.target.value})}>
            <option value="">Select...</option>
            <option value="300">Low (300 kWh)</option>
            <option value="600">Average (600 kWh)</option>
            <option value="1000">High (1,000+ kWh)</option>
          </select>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Step 3: Driving</h3>
          <p className="mb-2">Miles per week:</p>
          <select className="w-full p-2 border rounded mb-4" onChange={(e) => handleNext({miles: e.target.value})}>
            <option value="">Select...</option>
            <option value="50">Low (50 miles)</option>
            <option value="200">Average (200 miles)</option>
            <option value="400">High (400+ miles)</option>
          </select>
        </div>
      )}
      
      <div className="text-sm text-gray-400 mt-4">Step {step} of 3</div>
    </div>
  );
}