import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PastPrediction {
  date: string;
  event: string;
  fighter1: string;
  fighter2: string;
  keyDrivers: string[];
  futureFeatures: string[];
  modelPick: string;
  confidence: number;
  actual: string | null;
  method: string | null;
  round: number | null;
  correct: boolean | null;
}

interface FuturePrediction {
  date: string;
  event: string;
  fighter1: string;
  fighter2: string;
  userPick: string;
  modelPick: string | null;
  confidence: number | null;
  notes: string;
}

const pastPredictions: PastPrediction[] = [
  {
    date: "Jun 14, 2026",
    event: "UFC Freedom 250",
    fighter1: "Mauricio Ruffy",
    fighter2: "Michael Chandler",
    keyDrivers: [
      "Age gap: Ruffy 30 (peak prime) vs Chandler 40 — largest single signal in the model",
      "KD Avg: Ruffy 1.11 vs Chandler 0.42 — Ruffy hits harder per exchange",
      "Last 5 score: Ruffy 20/30 vs Chandler 5/30 — Chandler's only recent highlight was the Ferguson KO",
      "Reach: Ruffy +4 inches — controlled distance all night",
    ],
    futureFeatures: [
      "3-round vs 5-round model split — volume and early finishing matter more in shorter fights",
      "Weight class SLpM normalization — 5 SLpM means different things in different divisions",
    ],
    modelPick: "Mauricio Ruffy",
    confidence: 87.6,
    actual: "Mauricio Ruffy",
    method: "KO/TKO",
    round: 3,
    correct: true,
  },
  {
    date: "Jun 14, 2026",
    event: "UFC Freedom 250",
    fighter1: "Josh Hokit",
    fighter2: "Derrick Lewis",
    keyDrivers: [
      "Age: Hokit 29 vs Lewis 41 — nearly 10 years past athletic prime for Lewis",
      "SLpM: Hokit 9.25 vs Lewis 2.46 — heavyweight throwing at lightweight volume",
      "Striking accuracy: Hokit 62% vs Lewis 49% — lands more and lands cleaner",
      "TD Avg: Hokit 3.89 vs Lewis 0.37 — could take it to the ground whenever",
    ],
    futureFeatures: [
      "Weight class SLpM normalization — Hokit's 9.25 in HW is elite, but the model compares it raw to lightweights",
      "Per-weight-class prime age — heavyweights peak later than lighter divisions",
    ],
    modelPick: "Josh Hokit",
    confidence: 98.0,
    actual: "Josh Hokit",
    method: "KO/TKO",
    round: 3,
    correct: true,
  },
  {
    date: "Jun 14, 2026",
    event: "UFC Freedom 250",
    fighter1: "Sean O'Malley",
    fighter2: "Aeimann Zahabi",
    keyDrivers: [
      "Age: O'Malley 32 (at prime) vs Zahabi 39 — clear athletic advantage",
      "Striking accuracy: O'Malley 60% vs Zahabi 47% — lands on a different level",
      "Reach: O'Malley +4 inches at the same weight — controlled range all fight",
      "TD Accuracy: O'Malley 42% vs Zahabi 14% — grappling controlled in both directions",
    ],
    futureFeatures: [
      "Per-weight-class prime age — bantamweights may peak at a different age than middleweights",
      "Fight pace metric — O'Malley controls tempo in ways raw SLpM doesn't capture",
    ],
    modelPick: "Sean O'Malley",
    confidence: 99.6,
    actual: "Sean O'Malley",
    method: "Decision",
    round: 3,
    correct: true,
  },
  {
    date: "Jun 14, 2026",
    event: "UFC Freedom 250",
    fighter1: "Justin Gaethje",
    fighter2: "Ilia Topuria",
    keyDrivers: [
      "Age: Topuria 29 vs Gaethje 38 — model pushed hard toward Topuria",
      "TD Accuracy: Topuria 61% vs Gaethje 40% — elite wrestling edge",
      "KD Avg: Topuria 1.25 vs Gaethje 0.74 — higher single-shot power on paper",
      "Last 5 score: Topuria 21/30 vs Gaethje 12/30 — Topuria on a dominant streak",
    ],
    futureFeatures: [
      "Pressure fighter classification — Gaethje's 7.05 SApM looks like a weakness but is actually his fighting style",
      "Per-weight-class height normalization — Topuria at 5'7 is short for lightweight, model sees height diff but lacks division context",
      "Round-by-round stats — Gaethje adapted after round 2, model only sees career averages",
    ],
    modelPick: "Ilia Topuria",
    confidence: 82.7,
    actual: "Justin Gaethje",
    method: "TKO (Doctor Stoppage)",
    round: 4,
    correct: false,
  },
];

const futurePredictions: FuturePrediction[] = [];

const Predictions = () => {
  const [activeTab, setActiveTab] = useState<"past" | "future">("past");

  const correctCount = pastPredictions.filter((p) => p.correct === true).length;
  const totalResolved = pastPredictions.filter((p) => p.correct !== null).length;

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
          {totalResolved > 0 && (
            <p className="text-sm mt-3">
              <span className="text-green-500 font-bold">{correctCount}</span>
              <span className="text-muted-foreground"> / {totalResolved} correct</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-primary font-bold">
                {Math.round((correctCount / totalResolved) * 100)}%
              </span>
              <span className="text-muted-foreground"> accuracy</span>
            </p>
          )}
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
          <div className="space-y-6">
            {pastPredictions.map((p, i) => (
              <Card key={i} className="bg-card overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-border flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {p.event} · {p.date}
                    </p>
                    <p className="font-black text-xl tracking-tight">
                      {p.fighter1}{" "}
                      <span className="text-muted-foreground font-normal text-base">vs</span>{" "}
                      {p.fighter2}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Model Pick</p>
                      <p className="font-bold text-primary text-sm">{p.modelPick}</p>
                      <p className="text-xs text-muted-foreground">{p.confidence}% confidence</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Result</p>
                      {p.correct === null ? (
                        <Badge variant="secondary">Pending</Badge>
                      ) : p.correct ? (
                        <Badge className="bg-green-600 hover:bg-green-600">Correct</Badge>
                      ) : (
                        <Badge variant="destructive">Wrong</Badge>
                      )}
                      {p.actual && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {p.actual} · R{p.round} {p.method}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {/* Key Drivers */}
                  <div className="px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Features That Drove This Prediction
                    </p>
                    <ul className="space-y-2">
                      {p.keyDrivers.map((d, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary mt-0.5 shrink-0">—</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Future Features */}
                  <div className="px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Features To Add In The Future
                    </p>
                    <ul className="space-y-2">
                      {p.futureFeatures.map((f, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary mt-0.5 shrink-0">+</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Future Predictions */}
        {activeTab === "future" && (
          <div className="space-y-4">
            {futurePredictions.map((p, i) => (
              <Card key={i} className="p-6 bg-card border border-border">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        {p.event} · {p.date}
                      </p>
                    </div>
                    <p className="font-bold text-xl mb-4">
                      {p.fighter1}{" "}
                      <span className="text-muted-foreground font-normal text-base">vs</span>{" "}
                      {p.fighter2}
                    </p>
                    <div className="flex flex-wrap gap-6 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">My Pick</p>
                        <p className="font-bold text-primary">{p.userPick}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Model Pick</p>
                        <p className="font-bold text-foreground">
                          {p.modelPick ?? <span className="text-muted-foreground italic">Skipped</span>}
                        </p>
                        {p.confidence && (
                          <p className="text-xs text-muted-foreground">{p.confidence}% confidence</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                      {p.notes}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">Completed</Badge>
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
