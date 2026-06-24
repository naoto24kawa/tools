export interface FuelParams {
  distanceKm: number;
  fuelEfficiencyKmL: number;
  pricePerLiter: number;
}

export interface FuelResult {
  litersNeeded: number;
  fuelCost: number;
  co2Kg: number;
  monthlyEstimate: number;
  yearlyEstimate: number;
}

// ガソリン燃焼時のCO2排出係数 (kg-CO2/L) — 環境省公表値
const CO2_PER_LITER = 2.322;

export function calcFuelCost(params: FuelParams): FuelResult {
  const { distanceKm, fuelEfficiencyKmL, pricePerLiter } = params;

  if (distanceKm < 0) throw new Error('Distance must be non-negative');
  if (fuelEfficiencyKmL <= 0) throw new Error('Fuel efficiency must be positive');
  if (pricePerLiter < 0) throw new Error('Price per liter must be non-negative');

  const litersNeeded = distanceKm / fuelEfficiencyKmL;
  const fuelCost = litersNeeded * pricePerLiter;
  const co2Kg = litersNeeded * CO2_PER_LITER;
  const monthlyEstimate = fuelCost * 30;
  const yearlyEstimate = monthlyEstimate * 12;

  return { litersNeeded, fuelCost, co2Kg, monthlyEstimate, yearlyEstimate };
}
