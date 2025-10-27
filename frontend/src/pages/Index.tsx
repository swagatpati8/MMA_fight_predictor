import { useEffect, useState } from "react";
import { WeightClassSelector } from "@/components/WeightClassSelector";
import { FighterSelector } from "@/components/FighterSelector";
import { FighterDashboard } from "@/components/FighterDashboard";

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  record: string;
  image: string;
  wins: number;
  losses: number;
  last5: string;
  slpm: number;
  strAcc: number;
  sapm: number;
  strDef: number;
  tdAvg: number;
  tdAcc: number;
  tdDef: number;
  subAvg: number;
  kdAvg: number;
  ranking?: number;
  height: number;
  reach: number;
  subs: number;
}

const Index = () => {
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>("");
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [fighters, setFighters] = useState<Fighter[]>([]);

  const handleWeightClassChange = (wc: string) => {
    setSelectedWeightClass(wc);
    setFighter1(null);
    setFighter2(null);
  };
 
  useEffect(() => {
    const fetchFighters = async () => {
      const response = await fetch(`http://localhost:5000/api/fighters/${selectedWeightClass}`);
      const data = await response.json();
      setFighters(data);
    }
    fetchFighters();
  }, [selectedWeightClass])


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="sr-only">UFC-style MMA Fight Predictor</h1>

        <section aria-label="Fight selection" className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Weight Class</label>
            <WeightClassSelector
              selectedWeightClass={selectedWeightClass}
              onWeightClassChange={handleWeightClassChange}
            />
          </div>

          {selectedWeightClass && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Fighter 1</label>
                <FighterSelector
                  weightClass={selectedWeightClass}
                  selectedFighter={fighter1}
                  onFighterSelect={setFighter1}
                  excludeFighter={fighter2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fighter 2</label>
                <FighterSelector
                  weightClass={selectedWeightClass}
                  selectedFighter={fighter2}
                  onFighterSelect={setFighter2}
                  excludeFighter={fighter1}
                />
              </div>
            </div>
          )}
        </section>

        {fighter1 && fighter2 && (
          <section aria-label="Fight analysis" className="mt-8">
            <FighterDashboard fighter1={fighter1} fighter2={fighter2} />
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
