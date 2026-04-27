import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  date: string;
  fighter1: string;
  fighter2: string;
  predicted: string;
  actual: string | null;
  confidence: number;
}

const predictions: Prediction[] = [];

const PastPredictions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">
            PAST <span className="text-primary">PREDICTIONS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Track record of model predictions vs actual results</p>
        </div>

        {predictions.length === 0 ? (
          <Card className="p-12 text-center bg-card">
            <p className="text-muted-foreground text-lg">No predictions recorded yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Run a prediction to get started.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {predictions.map((p, i) => (
              <Card key={i} className="p-6 bg-card">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{p.date}</p>
                    <p className="font-bold text-lg">
                      {p.fighter1} <span className="text-muted-foreground font-normal">vs</span> {p.fighter2}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Predicted: <span className="text-foreground font-medium">{p.predicted}</span>
                      {" · "}Confidence: <span className="text-foreground font-medium">{p.confidence}%</span>
                    </p>
                  </div>
                  <div className="text-right">
                    {p.actual === null ? (
                      <Badge variant="secondary">Pending</Badge>
                    ) : p.actual === p.predicted ? (
                      <Badge className="bg-green-600 hover:bg-green-600">Correct</Badge>
                    ) : (
                      <Badge variant="destructive">Wrong</Badge>
                    )}
                    {p.actual && (
                      <p className="text-xs text-muted-foreground mt-1">Result: {p.actual}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastPredictions;
