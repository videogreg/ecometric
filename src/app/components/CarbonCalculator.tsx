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

  const calculateFootprint = (d: Data) => {
    // === SCIENTIFIC EMISSION FACTORS (tonnes CO2 per year) ===
    
    // 1. HOME HEATING (based on fuel type + sq ft + occupants)
    // Natural gas: ~0.0054 tonnes per sq ft/year | Oil: ~0.0078 | Electric: ~0.0032 | Heat pump: ~0.0011
    const heatingFactors: Record<string, number> = {
      gas: 0.0054,
      oil: 0.0078,
      electric: 0.0032,
      heatpump: 0.0011
    };
    const heatingRaw = (d.homeSize || 1500) * (heatingFactors[d.heatingType || 'gas'] || 0.0054);
    const heatingPerPerson = heatingRaw / (d.occupants || 2); // Divide by household occupants

    // 2. ELECTRICITY (~0.4 kg CO2 per kWh for US/Canada average grid)
    // 1 kWh = 0.0004 tonnes. Monthly * 12 = yearly
    const electricityTons = ((d.electricity || 800) * 12) * 0.0004;

    // 3. TRANSPORTATION
    // Gas car: 8.9 kg CO2/gallon. 25 mpg avg. Electric: ~0.05 kg/mile (grid). Hybrid: half of gas.
    const milesPerYear = (d.miles || 250) * 52;
    let transportTons = 0;
    if (d.vehicleType === 'electric') {
      transportTons = milesPerYear * 0.00005; // ~0.05 kg/mile from grid
    } else if (d.vehicleType === 'hybrid') {
      transportTons = (milesPerYear / 50) * 0.0089; // 50 mpg
    } else {
      transportTons = (milesPerYear / 25) * 0.0089; // 25 mpg gas
    }

    // 4. FLIGHTS (0.15 kg CO2 per mile flown. Short round trip = 1,500 miles. Long = 5,000+)
    const flightMilesPerTrip = 3000; // Average round trip
    const flightsTons = (d.flights || 2) * flightMilesPerTrip * 0.00015;

    // 5. DIET (tonnes per year)
    // Heavy meat: 3.3 | Moderate: 2.5 | Vegetarian: 1.5 | Vegan: 1.0
    const dietFactors: Record<string, number> = {
      heavymeat: 3.3,
      moderate: 2.5,
      vegetarian: 1.5,
      vegan: 1.0
    };
    const dietTons = dietFactors[d.diet || 'moderate'] || 2.5;

    // 6. GOODS & SERVICES (baseline consumption)
    // High shopper: 5.0 | Average: 3.5 | Low/minimalist: 2.0
    const shoppingFactors: Record<string, number> = {
      high: 5.0,
      average: 3.5,
      low: 2.0
    };
    const goodsTons = shoppingFactors[d.shopping || 'average'] || 3.5;

    // TOTAL (per person)
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
            onChange={(e) => handleNext({occupants: parseInt(e.target.value)})}
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
            onChange={(e) => handleNext({homeSize: parseInt(e.target.value)})}
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
            className="w-full p-2 border rounded" 
            onChange={(e) => handleNext({heatingType: e.target.value as Data['heatingType']})}
          >
            <option value="">Select...</option>
            <option value="gas">Natural Gas (most common)</option>
            <option value="oil">Heating Oil</option>
            <option value="electric">Electric baseboard</option>
            <option value="heatpump">Heat Pump (most efficient)</option>
          </select>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 2: Electricity</h3>
          <p className="text-sm text-gray-500 mb-4">Check your monthly utility bill for kWh</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly electricity use (kWh)</label>
          <select 
            className="w-full p-2 border rounded" 
            onChange={(e) => handleNext({electricity: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="300">Low (300 kWh) — small apt, efficient</option>
            <option value="600">Average (600 kWh) — typical home</option>
            <option value="900">High (900 kWh) — large home, AC</option>
            <option value="1400">Very High (1,400+ kWh) — large house, pool, etc.</option>
          </select>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 3: Transportation</h3>
          <p className="text-sm text-gray-500 mb-4">Cars and flights are usually the biggest personal source</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Miles driven per week</label>
          <select 
            className="w-full p-2 border rounded mb-3" 
            onChange={(e) => handleNext({miles: parseInt(e.target.value)})}
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
            onChange={(e) => handleNext({vehicleType: e.target.value as Data['vehicleType']})}
          >
            <option value="">Select...</option>
            <option value="gas">Gasoline car/truck/SUV</option>
            <option value="hybrid">Hybrid (Prius, etc.)</option>
            <option value="electric">Electric vehicle (Tesla, etc.)</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Round-trip flights per year</label>
          <select 
            className="w-full p-2 border rounded" 
            onChange={(e) => handleNext({flights: parseInt(e.target.value)})}
          >
            <option value="">Select...</option>
            <option value="0">None</option>
            <option value="1">1 short trip</option>
            <option value="3">2-3 trips (vacation + work)</option>
            <option value="6">4-6 trips (frequent traveler)</option>
            <option value="10">10+ trips (road warrior)</option>
          </select>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 4: Diet</h3>
          <p className="text-sm text-gray-500 mb-4">Meat production creates 10-50x more emissions than plants</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Your diet</label>
          <select 
            className="w-full p-2 border rounded" 
            onChange={(e) => handleNext({diet: e.target.value as Data['diet']})}
          >
            <option value="">Select...</option>
            <option value="heavymeat">Heavy meat — daily beef/pork/chicken</option>
            <option value="moderate">Moderate — meat 3-4x/week</option>
            <option value="vegetarian">Vegetarian — no meat, dairy ok</option>
            <option value="vegan">Vegan — plant-based only</option>
          </select>
        </div>
      )}

      {step === 5 && (
        <div>
          <h3 className="text-lg font-bold text-emerald-900 mb-1">Step 5: Shopping & Lifestyle</h3>
          <p className="text-sm text-gray-500 mb-4">Everything you buy has a carbon cost to manufacture and ship</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">General consumption level</label>
          <select 
            className="w-full p-2 border rounded" 
            onChange={(e) => handleNext({shopping: e.target.value as Data['shopping']})}
          >
            <option value="">Select...</option>
            <option value="low">Minimalist — buy little, reuse, secondhand</option>
            <option value="average">Average — normal shopping, some online</option>
            <option value="high">High — frequent new gadgets, clothes, Amazon</option>
          </select>
        </div>
      )}
    </div>
  );
}