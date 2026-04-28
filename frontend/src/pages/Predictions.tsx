import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PastPrediction {
  date: string;
  fighter1: string;
  fighter2: string;
  predicted: string;
  actual: string | null;
  confidence: number;
}

interface FuturePrediction {
  date: string;
  fighter1: string;
  fighter2: string;
  userPick: string;
  modelPick: string | null;
  notes: string;
  betPlaced: boolean;
}

const pastPredictions: PastPrediction[] = [];

const futurePredictions: FuturePrediction[] = [
  {
    date: "May 3, 2025",
    fighter1: "Jack Della Maddalena",
    fighter2: "Carlos Prates",
    userPick: "Jack Della Maddalena",
    modelPick: null,
    notes:
      "JDM has fought elite competition (Islam, Belal) and is the superior boxer with better combinations. Model skipped — biased toward knockdown averages which favors Prates.",
    betPlaced: true,
  },
];

const Predictions = () => {
  const [activeTab, setActiveTab] = useState<"past" | "future">("past");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-primary">MY</span> PREDICTIONS
          </h1>
          <p className="text-muted-foreground mt-2">
            Track record and upcoming fight picks
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("past")}
            className={`relative px-6 py-3 text-sm font-bold tracking-wider transition-colors ${
              activeTab === "past"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-primary">PAST</span> PREDICTIONS
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("future")}
            className={`relative px-6 py-3 text-sm font-bold tracking-wider transition-colors ${
              activeTab === "future"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-primary">FUTURE</span> PREDICTIONS
            {activeTab === "future" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Past Predictions */}
        {activeTab === "past" && (
          <>
            {pastPredictions.length === 0 ? (
              <Card className="p-12 text-center bg-card">
                <p className="text-muted-foreground text-lg">
                  No predictions recorded yet.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Run a prediction to get started.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastPredictions.map((p, i) => (
                  <Card key={i} className="p-6 bg-card">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {p.date}
                        </p>
                        <p className="font-bold text-lg">
                          {p.fighter1}{" "}
                          <span className="text-muted-foreground font-normal">
                            vs
                          </span>{" "}
                          {p.fighter2}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Predicted:{" "}
                          <span className="text-foreground font-medium">
                            {p.predicted}
                          </span>
                          {" · "}Confidence:{" "}
                          <span className="text-foreground font-medium">
                            {p.confidence}%
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        {p.actual === null ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : p.actual === p.predicted ? (
                          <Badge className="bg-green-600 hover:bg-green-600">
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Wrong</Badge>
                        )}
                        {p.actual && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Result: {p.actual}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Future Predictions */}
        {activeTab === "future" && (
          <div className="space-y-4">
            {futurePredictions.map((p, i) => (
              <Card key={i} className="p-6 bg-card border border-border">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs text-muted-foreground">{p.date}</p>
                      {p.betPlaced && (
                        <Badge className="bg-yellow-600 hover:bg-yellow-600 text-xs">
                          BET PLACED
                        </Badge>
                      )}
                    </div>
                    <p className="font-bold text-xl mb-3">
                      {p.fighter1}{" "}
                      <span className="text-muted-foreground font-normal text-base">
                        vs
                      </span>{" "}
                      {p.fighter2}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          My Pick
                        </p>
                        <p className="font-bold text-primary">{p.userPick}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Model Pick
                        </p>
                        <p className="text-muted-foreground italic">
                          {p.modelPick ?? "Skipped"}
                        </p>
                      </div>
                    </div>
                    {p.notes && (
                      <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                        {p.notes}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    Upcoming
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions;
