interface RankedFighter {
  rank: number;
  name: string;
  score: number;
}

const goatList: RankedFighter[] = [
  { rank: 1, name: "Anderson Silva", score: 1797.7 },
  { rank: 2, name: "Georges St-Pierre", score: 1790.0 },
  { rank: 3, name: "Jon Jones", score: 1788.9 },
  { rank: 4, name: "Islam Makhachev", score: 1773.7 },
  { rank: 5, name: "Daniel Cormier", score: 1767.2 },
  { rank: 6, name: "Max Holloway", score: 1735.3 },
  { rank: 7, name: "Kamaru Usman", score: 1731.5 },
  { rank: 8, name: "Jose Aldo", score: 1730.4 },
  { rank: 9, name: "Khabib Nurmagomedov", score: 1729.7 },
  { rank: 10, name: "Alexander Volkanovski", score: 1727.2 },
  { rank: 11, name: "Dustin Poirier", score: 1723.9 },
  { rank: 12, name: "Merab Dvalishvili", score: 1723.6 },
  { rank: 13, name: "Demetrious Johnson", score: 1721.0 },
  { rank: 14, name: "Donald Cerrone", score: 1719.4 },
  { rank: 15, name: "Charles Oliveira", score: 1718.9 },
  { rank: 16, name: "Ilia Topuria", score: 1716.8 },
  { rank: 17, name: "Leon Edwards", score: 1716.1 },
  { rank: 18, name: "Stipe Miocic", score: 1704.0 },
  { rank: 19, name: "Aljamain Sterling", score: 1703.3 },
  { rank: 20, name: "Luke Rockhold", score: 1702.5 },
  { rank: 21, name: "Khamzat Chimaev", score: 1698.8 },
  { rank: 22, name: "Israel Adesanya", score: 1698.1 },
  { rank: 23, name: "Alex Pereira", score: 1691.1 },
  { rank: 24, name: "Magomed Ankalaev", score: 1689.4 },
  { rank: 25, name: "Dricus Du Plessis", score: 1687.1 },
  { rank: 26, name: "Francis Ngannou", score: 1686.5 },
  { rank: 27, name: "Sean O'Malley", score: 1682.3 },
  { rank: 28, name: "Alexandre Pantoja", score: 1676.9 },
  { rank: 29, name: "Dominick Cruz", score: 1673.8 },
  { rank: 30, name: "Robert Whittaker", score: 1673.3 },
];

const Rankings = () => {
  const champion = goatList[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="sr-only">UFC GOAT List</h1>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-primary text-xs font-bold tracking-wider">
                UFC
              </span>
              <span className="text-foreground text-xs font-bold tracking-wider">
                GOAT LIST
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              {champion.name}
            </h2>
            <p className="text-muted-foreground text-xs font-medium tracking-wider mt-1">
              #1 BY PEAK ELO
            </p>
          </div>

          {/* Champion placeholder image area */}
          <div className="h-32 bg-gradient-to-b from-muted to-transparent mb-4 rounded flex items-center justify-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {champion.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          {/* Rankings list */}
          <div className="space-y-0">
            {goatList.map((fighter) => (
              <div
                key={fighter.rank}
                className="flex items-center py-3 border-b border-border/50 hover:bg-muted/30 transition-colors group"
              >
                <span className="w-8 text-muted-foreground font-bold text-sm">
                  {fighter.rank}
                </span>
                <span className="flex-1 font-medium text-sm group-hover:text-primary transition-colors">
                  {fighter.name}
                </span>
                <span className="text-muted-foreground text-xs font-mono">
                  {fighter.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
