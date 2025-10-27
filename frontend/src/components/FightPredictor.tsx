import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Fighter } from "@/pages/Index";

interface FightPredictorProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

interface PredictionResult {
  winner: Fighter;
  confidence: number;
  winProbability: number;
  method: string;
  round: number;
}

interface StatComparison {
  stat: string;
  fighter1Value: number;
  fighter2Value: number;
  advantage: 'fighter1' | 'fighter2' | 'even';
}

export const FightPredictor = ({ fighter1, fighter2 }: FightPredictorProps) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock ML prediction - in real app this would call your trained model
  useEffect(() => {
    const simulatePrediction = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple mock prediction logic
      const fighter1Score = calculateFighterScore(fighter1);
      const fighter2Score = calculateFighterScore(fighter2);
      
      const winner = fighter1Score > fighter2Score ? fighter1 : fighter2;
      const confidence = Math.abs(fighter1Score - fighter2Score) / Math.max(fighter1Score, fighter2Score) * 100;
      const winProbability = fighter1Score > fighter2Score 
        ? (fighter1Score / (fighter1Score + fighter2Score)) * 100
        : (fighter2Score / (fighter1Score + fighter2Score)) * 100;
      
      setPrediction({
        winner,
        confidence: Math.min(confidence, 85), // Cap confidence at 85%
        winProbability,
        method: getRandomMethod(),
        round: Math.floor(Math.random() * 5) + 1
      });
      
      setIsLoading(false);
    };

    simulatePrediction();
  }, [fighter1, fighter2]);

  const calculateFighterScore = (fighter: Fighter): number => {
    const winRate = fighter.wins / (fighter.wins + fighter.losses);
    const recentForm = fighter.last5.split('').filter(r => r === 'W').length / 5;
    
    return (
      winRate * 30 +
      recentForm * 20 +
      fighter.strAcc * 15 +
      fighter.strDef * 10 +
      fighter.tdDef * 10 +
      (fighter.ranking ? (10 - fighter.ranking) * 2 : 0) +
      fighter.kdAvg * 5 +
      fighter.subAvg * 3
    );
  };

  const getRandomMethod = (): string => {
    const methods = ["Decision", "TKO/KO", "Submission", "Decision"];
    return methods[Math.floor(Math.random() * methods.length)];
  };

  const getStatComparisons = (): StatComparison[] => {
    return [
      {
        stat: "Win Rate",
        fighter1Value: (fighter1.wins / (fighter1.wins + fighter1.losses)) * 100,
        fighter2Value: (fighter2.wins / (fighter2.wins + fighter2.losses)) * 100,
        advantage: 'even'
      },
      {
        stat: "Striking Accuracy",
        fighter1Value: fighter1.strAcc * 100,
        fighter2Value: fighter2.strAcc * 100,
        advantage: 'even'
      },
      {
        stat: "Striking Defense",
        fighter1Value: fighter1.strDef * 100,
        fighter2Value: fighter2.strDef * 100,
        advantage: 'even'
      },
      {
        stat: "Takedown Defense",
        fighter1Value: fighter1.tdDef * 100,
        fighter2Value: fighter2.tdDef * 100,
        advantage: 'even'
      },
      {
        stat: "KD Average",
        fighter1Value: fighter1.kdAvg,
        fighter2Value: fighter2.kdAvg,
        advantage: 'even'
      },
      {
        stat: "Sub Average",
        fighter1Value: fighter1.subAvg,
        fighter2Value: fighter2.subAvg,
        advantage: 'even'
      }
    ].map(stat => ({
      ...stat,
      advantage: stat.fighter1Value > stat.fighter2Value * 1.1 ? 'fighter1' : 
                 stat.fighter2Value > stat.fighter1Value * 1.1 ? 'fighter2' : 'even'
    }));
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-card shadow-card">
        <div className="space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-2xl font-bold">Analyzing Fight Data...</h3>
          <p className="text-muted-foreground">Processing 27 statistical features through our ML model</p>
        </div>
      </Card>
    );
  }

  if (!prediction) return null;

  return (
    <div className="space-y-8">
      {/* Prediction Result */}
      <Card className="p-8 text-center bg-gradient-primary shadow-glow">
        <h2 className="text-4xl font-black mb-4">PREDICTION RESULT</h2>
        <div className="space-y-4">
          <div className="text-6xl font-black text-primary-glow">
            {prediction.winner.name.toUpperCase()}
          </div>
          {prediction.winner.nickname && (
            <div className="text-2xl font-bold opacity-80">
              "{prediction.winner.nickname}"
            </div>
          )}
          <div className="flex justify-center space-x-6 text-lg">
            <Badge variant="secondary" className="px-4 py-2">
              {prediction.confidence.toFixed(1)}% Confidence
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              {prediction.method} in Round {prediction.round}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Win Probability */}
      <Card className="p-6 bg-card shadow-card">
        <h3 className="text-2xl font-bold mb-6 text-center">Win Probability</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">{fighter1.name}</span>
            <span className="text-primary font-bold">
              {prediction.winner.id === fighter1.id ? prediction.winProbability.toFixed(1) : (100 - prediction.winProbability).toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={prediction.winner.id === fighter1.id ? prediction.winProbability : 100 - prediction.winProbability} 
            className="h-4"
          />
          <div className="flex justify-between items-center">
            <span className="font-bold">{fighter2.name}</span>
            <span className="text-primary font-bold">
              {prediction.winner.id === fighter2.id ? prediction.winProbability.toFixed(1) : (100 - prediction.winProbability).toFixed(1)}%
            </span>
          </div>
        </div>
      </Card>

      {/* Statistical Comparison */}
      <Card className="p-6 bg-card shadow-card">
        <h3 className="text-2xl font-bold mb-6 text-center">Statistical Comparison</h3>
        <div className="space-y-6">
          {getStatComparisons().map((comparison, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{comparison.stat}</span>
                <div className="flex space-x-4">
                  <span className={`font-bold ${
                    comparison.advantage === 'fighter1' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {comparison.stat.includes('Average') ? 
                      comparison.fighter1Value.toFixed(2) : 
                      comparison.fighter1Value.toFixed(1) + '%'
                    }
                  </span>
                  <span className="text-muted-foreground">vs</span>
                  <span className={`font-bold ${
                    comparison.advantage === 'fighter2' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {comparison.stat.includes('Average') ? 
                      comparison.fighter2Value.toFixed(2) : 
                      comparison.fighter2Value.toFixed(1) + '%'
                    }
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Progress 
                  value={comparison.fighter1Value > comparison.fighter2Value ? 100 : 
                         (comparison.fighter1Value / comparison.fighter2Value) * 100} 
                  className="h-2"
                />
                <Progress 
                  value={comparison.fighter2Value > comparison.fighter1Value ? 100 : 
                         (comparison.fighter2Value / comparison.fighter1Value) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};