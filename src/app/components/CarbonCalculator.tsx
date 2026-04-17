'use client';
import { useState } from 'react';
import ResultsPanel from './ResultsPanel';

type Data = {
  homeSize?: number;
  electricity?: number;
  miles?: number;
};

export default function CarbonCalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({});
  const [result, setResult] = useState<string | null>(null);

  const calculateFootprint = () => {
    const homeEmissions = (data.homeSize ?? 1000) * 0.003;
    const energyEmissions = (data.electricity ?? 500) * 0.0004;
    const carEmissions = (data.miles ?? 100) * 0.0004;
    const total = homeEmissions + energyEmissions + carEmissions;
    return total.toFixed(2);
  };

  const handleNext = (newData: Partial<Data>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    if (step < 3) {
      setStep(step + 1);
    } else {
      const score = calculateFootprint();
      setResult(score);
    }
  };

  if (result) {
    return (
      <ResultsPanel 
        carbonScore={parseFloat(result)} 
        onRestart={() => {
          setResult(null);
          setStep(1);
          setData({});
        }}
        userData={data}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-left">
      {step === 1 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Step 1: Home Size</h3>
          <p className="mb-2">Square feet:</p>
          <select className="w-full p-2 border rounded mb-4" onChange={(e) => handleNext({homeSize: parseInt(e.target.value)})}>
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
          <select className="w-full p-2 border rounded mb-4" onChange={(e) => handleNext({electricity: parseInt(e.target.value)})}>
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
          <select className="w-full p-2 border rounded mb-4" onChange={(e) => handleNext({miles: parseInt(e.target.value)})}>
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