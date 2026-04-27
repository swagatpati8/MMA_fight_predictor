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
  fighter1WinProb: number;
  fighter2WinProb: number;
  round: number;
}

export const FighterDashboard = ({ fighter1, fighter2 }: FighterDashboardProps) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://mmafightpredictor-production.up.railway.app/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fighter1: fighter1.name, fighter2: fighter2.name }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Prediction failed');
        setPrediction({
          winner: data.predicted_winner.toLowerCase() === fighter1.name.toLowerCase() ? fighter1 : fighter2,
          fighter1WinProb: data.fighter1_win_prob,
          fighter2WinProb: data.fighter2_win_prob,
          round: data.predicted_round,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrediction();
  }, [fighter1, fighter2]);

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

  if (error) {
    return (
      <Card className="p-8 text-center bg-card">
        <p className="text-red-500 font-medium">Prediction error: {error}</p>
        <p className="text-muted-foreground text-sm mt-2">Make sure both fighters are in the database.</p>
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
            {fighter1.ranking !== undefined && fighter1.ranking !== null && (
              <Badge variant="secondary" className="mt-2">
                {fighter1.ranking === 0 ? "Champion" : `#${fighter1.ranking} Ranked`}
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
                <p className="font-bold">{(fighter1.height / 100).toFixed(2)} m</p>
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
                  <span className="font-bold">{(fighter1.strAcc).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.strAcc} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Striking Defense</span>
                  <span className="font-bold">{(fighter1.strDef).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.strDef} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Defense</span>
                  <span className="font-bold">{(fighter1.tdDef).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.tdDef} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Accuracy</span>
                  <span className="font-bold">{(fighter1.tdAcc).toFixed(1)}%</span>
                </div>
                <Progress value={fighter1.tdAcc} className="h-2" />
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

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Last 5 Wins</span>
                <span className="font-bold">{fighter1.last5}/30</span>
              </div>
              <Progress value={(fighter1.last5 / 30) * 100} className="h-2" />
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
            {fighter2.ranking !== undefined && fighter2.ranking !== null && (
              <Badge variant="secondary" className="mt-2">
                {fighter2.ranking === 0 ? "Champion" : `#${fighter2.ranking} Ranked`}
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
                <p className="font-bold">{(fighter2.height / 100).toFixed(2)} m</p>
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
                  <span className="font-bold">{(fighter2.strAcc).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.strAcc} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Striking Defense</span>
                  <span className="font-bold">{(fighter2.strDef).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.strDef} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Defense</span>
                  <span className="font-bold">{(fighter2.tdDef).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.tdDef} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Takedown Accuracy</span>
                  <span className="font-bold">{(fighter2.tdAcc).toFixed(1)}%</span>
                </div>
                <Progress value={fighter2.tdAcc} className="h-2" />
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

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Last 5 Wins</span>
                <span className="font-bold">{fighter2.last5}/30</span>
              </div>
              <Progress value={(fighter2.last5 / 30) * 100} className="h-2" />
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
                {prediction.fighter1WinProb.toFixed(1)}%
              </div>
              <Progress value={prediction.fighter1WinProb} className="h-4" />
              <div className="text-left font-bold text-2xl text-primary">
                {prediction.fighter2WinProb.toFixed(1)}%
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
              {prediction.winner.id === fighter1.id ? prediction.fighter1WinProb : prediction.fighter2WinProb}% Win Probability
            </Badge>
            <Badge variant="secondary" className="bg-white/20">
              Predicted Round {prediction.round === 6 ? "- Decision" : prediction.round}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};