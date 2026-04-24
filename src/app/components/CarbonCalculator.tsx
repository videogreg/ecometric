'use client';
import { useState } from 'react';
import ResultsPanel from './ResultsPanel';

type Data = {
  homeSize?: number;
  heatingType?: 'gas' | 'electric' | 'oil' | 'heatpump';
  occupants?: number;
  electricity?: number;
  miles?: number;
  vehicleType?: 'gas' | 'hybrid' | 'electric';
  flights?: number;
  diet?: 'heavymeat' | 'moderate' | 'vegetarian' | 'vegan';
  shopping?: 'high' | 'average' | 'low';
};

export default function CarbonCalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({});
  const [result, setResult] = useState<{
    total: string;
    breakdown: Record<string, number>;
  } | null>(null);

  // Step-local state so user can change selections before submitting
  const [step1, setStep1] = useState<{occupants?: number; homeSize?: number; heatingType?: Data['heatingType']}>({});
  const [step2, setStep2] = useState<{electricity?: number}>({});
  const [step3, setStep3] = useState<{miles?: number; vehicleType?: Data['vehicleType']; flights?: number}>({});
  const [step4, setStep4] = useState<{diet?: Data['diet']}>({});
  const [step5, setStep5] = useState<{shopping?: Data['shopping']}>({});

  const calculateFootprint = (d: Data) => {
    const heatingFactors: Record<string, number> = {
      gas: 0.0054,
      oil: 0.0078,
      electric: 0.0032,
      heatpump: 0.0011
    };
    const heatingRaw = (d.homeSize || 1500) * (heatingFactors[d.heatingType || 'gas'] || 0.0054);
    const heatingPerPerson = heatingRaw / (d.occupants || 2);
    const electricityTons = ((d.electricity || 800) * 12) * 0.0004;

    const milesPerYear = (d.miles || 250) * 52;
    let transportTons = 0;
    if (d.vehicleType === 'electric') transportTons = milesPerYear * 0.00005;
    else if (d.vehicleType === 'hybrid') transportTons = (milesPerYear / 50) * 0.0089;
    else transportTons = (milesPerYear / 25) * 0.0089;

    const flightMilesPerTrip = 3000;
    const flightsTons = (d.flights || 2) * flightMilesPerTrip * 0.00015;

    const dietFactors: Record<string, number> = {
      heavymeat: 3.3,
      moderate: 2.5,
      vegetarian: 1.5,
      vegan: 1.0
    };
    const dietTons = dietFactors[d.diet || 'moderate'] || 2.5;

    const shoppingFactors: Record<string, number> = {
      high: 5.0,
      average: 3.5,
      low: 2.0
    };
    const goodsTons = shoppingFactors[d.shopping || 'average'] || 3.5;

    const total = heatingPerPerson + electricityTons + transportTons + flightsTons + dietTons + goodsTons;

    return {
      total: total.toFixed(2),
      breakdown: {
        'Home Heating': parseFloat(heatingPerPerson.toFixed(2)),
        'Electricity': parseFloat(electricityTons.toFixed(2)),
        'Transportation': parseFloat(transportTons.toFixed(2)),
        'Flights': parseFloat(flightsTons.toFixed(2)),
        'Diet': parseFloat(dietTons.toFixed(2)),
        'Goods & Services': parseFloat(goodsTons.toFixed(2))
      }
    };
  };

  const handleNext = (newData: Partial<Data>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    if (step < 5) {
      setStep(step + 1);
    } else {
      const score = calculateFootprint(updatedData);
      setResult(score);
    }
  };

  if (result) {
    return (
      <ResultsPanel 
        carbonScore={parseFloat(result.total)} 
        breakdown={result.breakdown}
        onRestart={() => {
          setResult(null);
          setStep(1);
          setData({});
          setStep1({});
          setStep2({});
          setStep3({});
          setStep4({});
          setStep5({});
        }}
        userData={data}
      />
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-lg mx-auto text-left border border-emerald-100">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Step {step} of 5</span>
          <span>{Math.round((step / 5) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 1: Home & Heating</h3>
          <p className="text-sm text-gray-500 mb-4">Heating is often the #1 source of home emissions</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">How many people live in your home?</label>
          <select 
            className="w-full p-2 border rounded mb-3" 
            value={step1.occupants || ''}
            onChange={(e) => setStep1({...step1, occupants: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="1">Just me</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5">5+ people</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Home size (sq ft)</label>
          <select 
            className="w-full p-2 border rounded mb-3" 
            value={step1.homeSize || ''}
            onChange={(e) => setStep1({...step1, homeSize: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="600">Small apartment (600 sq ft)</option>
            <option value="1000">Small house (1,000 sq ft)</option>
            <option value="1500">Average house (1,500 sq ft)</option>
            <option value="2200">Large house (2,200 sq ft)</option>
            <option value="3500">Very large (3,500+ sq ft)</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Primary heating source</label>
          <select 
            className="w-full p-2 border rounded mb-4" 
            value={step1.heatingType || ''}
            onChange={(e) => setStep1({...step1, heatingType: e.target.value as Data['heatingType']})}
          >
            <option value="">Select...</option>
            <option value="gas">Natural Gas (most common)</option>
            <option value="oil">Heating Oil</option>
            <option value="electric">Electric baseboard</option>
            <option value="heatpump">Heat Pump (most efficient)</option>
          </select>

          <button
            onClick={() => handleNext({ occupants: step1.occupants, homeSize: step1.homeSize, heatingType: step1.heatingType })}
            disabled={!step1.occupants || !step1.homeSize || !step1.heatingType}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 font-semibold transition"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 2: Electricity</h3>
          <p className="text-sm text-gray-500 mb-4">Check your monthly utility bill for kWh</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly electricity use (kWh)</label>
          <select 
            className="w-full p-2 border rounded mb-4" 
            value={step2.electricity || ''}
            onChange={(e) => setStep2({...step2, electricity: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="300">Low (300 kWh) — small apt, efficient</option>
            <option value="600">Average (600 kWh) — typical home</option>
            <option value="900">High (900 kWh) — large home, AC</option>
            <option value="1400">Very High (1,400+ kWh) — large house, pool</option>
          </select>

          <button
            onClick={() => handleNext({ electricity: step2.electricity })}
            disabled={!step2.electricity}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 font-semibold transition"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 3: Transportation</h3>
          <p className="text-sm text-gray-500 mb-4">Cars and flights are usually the biggest personal source</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Miles driven per week</label>
          <select 
            className="w-full p-2 border rounded mb-3" 
            value={step3.miles || ''}
            onChange={(e) => setStep3({...step3, miles: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="50">Low (50 mi) — mostly transit/bike</option>
            <option value="200">Average (200 mi) — commute + errands</option>
            <option value="400">High (400 mi) — long commute/travel</option>
            <option value="700">Very High (700+ mi) — sales/truck driver</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle type</label>
          <select 
            className="w-full p-2 border rounded mb-3" 
            value={step3.vehicleType || ''}
            onChange={(e) => setStep3({...step3, vehicleType: e.target.value as Data['vehicleType']})}
          >
            <option value="">Select...</option>
            <option value="gas">Gasoline car/truck/SUV</option>
            <option value="hybrid">Hybrid (Prius, etc.)</option>
            <option value="electric">Electric vehicle (Tesla, etc.)</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Round-trip flights per year</label>
          <select 
            className="w-full p-2 border rounded mb-4" 
            value={step3.flights || ''}
            onChange={(e) => setStep3({...step3, flights: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="0">None</option>
            <option value="1">1 short trip</option>
            <option value="3">2-3 trips (vacation + work)</option>
            <option value="6">4-6 trips (frequent traveler)</option>
            <option value="10">10+ trips (road warrior)</option>
          </select>

          <button
            onClick={() => handleNext({ miles: step3.miles, vehicleType: step3.vehicleType, flights: step3.flights })}
            disabled={!step3.miles || !step3.vehicleType || step3.flights === undefined}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 font-semibold transition"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 4: Diet</h3>
          <p className="text-sm text-gray-500 mb-4">Meat production creates 10-50x more emissions than plants</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Your diet</label>
          <select 
            className="w-full p-2 border rounded mb-4" 
            value={step4.diet || ''}
            onChange={(e) => setStep4({...step4, diet: e.target.value as Data['diet']})}
          >
            <option value="">Select...</option>
            <option value="heavymeat">Heavy meat — daily beef/pork/chicken</option>
            <option value="moderate">Moderate — meat 3-4x/week</option>
            <option value="vegetarian">Vegetarian — no meat, dairy ok</option>
            <option value="vegan">Vegan — plant-based only</option>
          </select>

          <button
            onClick={() => handleNext({ diet: step4.diet })}
            disabled={!step4.diet}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 font-semibold transition"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 5: Shopping & Lifestyle</h3>
          <p className="text-sm text-gray-500 mb-4">Everything you buy has a carbon cost to manufacture and ship</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">General consumption level</label>
          <select 
            className="w-full p-2 border rounded mb-4" 
            value={step5.shopping || ''}
            onChange={(e) => setStep5({...step5, shopping: e.target.value as Data['shopping']})}
          >
            <option value="">Select...</option>
            <option value="low">Minimalist — buy little, reuse, secondhand</option>
            <option value="average">Average — normal shopping, some online</option>
            <option value="high">High — frequent new gadgets, clothes, Amazon</option>
          </select>

          <button
            onClick={() => handleNext({ shopping: step5.shopping })}
            disabled={!step5.shopping}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 font-semibold transition"
          >
            Calculate My Footprint →
          </button>
        </div>
      )}
    </div>
  );
}