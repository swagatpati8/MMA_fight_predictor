import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Fighter } from "@/pages/Index";

interface FighterDashboardProps {
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

export const FighterDashboard = ({ fighter1, fighter2 }: FighterDashboardProps) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulatePrediction = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fighter1Score = calculateFighterScore(fighter1);
      const fighter2Score = calculateFighterScore(fighter2);
      
      const winner = fighter1Score > fighter2Score ? fighter1 : fighter2;
      const confidence = Math.abs(fighter1Score - fighter2Score) / Math.max(fighter1Score, fighter2Score) * 100;
      const winProbability = fighter1Score > fighter2Score 
        ? (fighter1Score / (fighter1Score + fighter2Score)) * 100
        : (fighter2Score / (fighter1Score + fighter2Score)) * 100;
      
      setPrediction({
        winner,
        confidence: Math.min(confidence, 85),
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
    const methods = ["Decision", "TKO/KO", "Submission"];
    return methods[Math.floor(Math.random() * methods.length)];
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-card">
        <div className="space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-2xl font-bold">Analyzing Fight Data...</h3>
          <p className="text-muted-foreground">Processing statistical features through ML model</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Prediction Result */}
      

      {/* Fighter Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fighter 1 Card */}
        <Card className="p-6 bg-card">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold">
                {fighter1.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-2xl font-bold">{fighter1.name}</h3>
            {fighter1.nickname && (
              <p className="text-primary font-medium">"{fighter1.nickname}"</p>
            )}
            <p className="text-muted-foreground">{fighter1.record}</p>
            {fighter1.ranking && (
              <Badge variant="secondary" className="mt-2">
                #{fighter1.ranking} Ranked
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Wins</span>
                <p className="font-bold text-lg">{fighter1.wins}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Losses</span>
                <p className="font-bold text-lg">{fighter1.losses}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Height</span>
                <p className="font-bold">{Math.floor(fighter1.height / 12)}'{fighter1.height % 12}"</p>
              </div>
              <div>
                <span className="text-muted-foreground">Reach</span>
                <p className="font-bold">{fighter1.reach}"</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Striking Accuracy</span>
                  <span className="font-bold">{(fighter1.strAcc * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.strAcc * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Striking Defense</span>
                  <span className="font-bold">{(fighter1.strDef * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.strDef * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Defense</span>
                  <span className="font-bold">{(fighter1.tdDef * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.tdDef * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Accuracy</span>
                  <span className="font-bold">{(fighter1.tdAcc * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.tdAcc * 100} className="h-2" />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <span className="text-muted-foreground block">SLpM</span>
                <span className="font-bold">{fighter1.slpm}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">KD Avg</span>
                <span className="font-bold">{fighter1.kdAvg}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Sub Avg</span>
                <span className="font-bold">{fighter1.subAvg}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-muted-foreground text-sm">Last 5 Fights</span>
              <div className="flex justify-center space-x-1 mt-1">
                {fighter1.last5.split('').map((result, index) => (
                  <span 
                    key={index}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      result === 'W' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Fighter 2 Card */}
        <Card className="p-6 bg-card">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold">
                {fighter2.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-2xl font-bold">{fighter2.name}</h3>
            {fighter2.nickname && (
              <p className="text-primary font-medium">"{fighter2.nickname}"</p>
            )}
            <p className="text-muted-foreground">{fighter2.record}</p>
            {fighter2.ranking && (
              <Badge variant="secondary" className="mt-2">
                #{fighter2.ranking} Ranked
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Wins</span>
                <p className="font-bold text-lg">{fighter2.wins}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Losses</span>
                <p className="font-bold text-lg">{fighter2.losses}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Height</span>
                <p className="font-bold">{Math.floor(fighter2.height / 12)}'{fighter2.height % 12}"</p>
              </div>
              <div>
                <span className="text-muted-foreground">Reach</span>
                <p className="font-bold">{fighter2.reach}"</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Striking Accuracy</span>
                  <span className="font-bold">{(fighter2.strAcc * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.strAcc * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Striking Defense</span>
                  <span className="font-bold">{(fighter2.strDef * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.strDef * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Defense</span>
                  <span className="font-bold">{(fighter2.tdDef * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.tdDef * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Accuracy</span>
                  <span className="font-bold">{(fighter2.tdAcc * 100).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.tdAcc * 100} className="h-2" />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <span className="text-muted-foreground block">SLpM</span>
                <span className="font-bold">{fighter2.slpm}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">KD Avg</span>
                <span className="font-bold">{fighter2.kdAvg}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Sub Avg</span>
                <span className="font-bold">{fighter2.subAvg}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-muted-foreground text-sm">Last 5 Fights</span>
              <div className="flex justify-center space-x-1 mt-1">
                {fighter2.last5.split('').map((result, index) => (
                  <span 
                    key={index}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      result === 'W' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistical Comparison */}
      {prediction && (
        <Card className="p-6 bg-card">
          <h3 className="text-2xl font-bold mb-6 text-center">Head-to-Head Comparison</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center items-center">
              <div className="font-bold">{fighter1.name}</div>
              <div className="text-muted-foreground font-medium">Win Probability</div>
              <div className="font-bold">{fighter2.name}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-right font-bold text-2xl text-primary">
                {prediction.winner.id === fighter1.id ? prediction.winProbability.toFixed(1) : (100 - prediction.winProbability).toFixed(1)}%
              </div>
              <Progress 
                value={prediction.winner.id === fighter1.id ? prediction.winProbability : 100 - prediction.winProbability} 
                className="h-4"
              />
              <div className="text-left font-bold text-2xl text-primary">
                {prediction.winner.id === fighter2.id ? prediction.winProbability.toFixed(1) : (100 - prediction.winProbability).toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      )}

      {prediction && (
        <Card className="p-6 text-center bg-gradient-primary text-white">
          <h2 className="text-3xl font-bold mb-4">PREDICTION</h2>
          <div className="text-4xl font-black text-primary-glow mb-2">
            {prediction.winner.name.toUpperCase()}
          </div>
          {prediction.winner.nickname && (
            <div className="text-xl font-bold opacity-80 mb-4">
              "{prediction.winner.nickname}"
            </div>
          )}
          <div className="flex justify-center space-x-4 text-sm">
            <Badge variant="secondary" className="bg-white/20">
              {prediction.confidence.toFixed(1)}% Confidence
            </Badge>
            <Badge variant="secondary" className="bg-white/20">
              {prediction.method} - R{prediction.round}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};