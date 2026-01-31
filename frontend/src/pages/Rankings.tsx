import { Card } from "@/components/ui/card";

interface RankedFighter {
  rank: number;
  name: string;
  change?: { direction: "up" | "down"; positions: number };
}

interface RankingCategory {
  title: string;
  titleHighlight?: string;
  champion: {
    name: string;
    nickname?: string;
  };
  fighters: RankedFighter[];
}

const p4pRankings: RankingCategory = {
  title: "MEN'S POUND-FOR-POUND",
  titleHighlight: "TOP RANK",
  champion: { name: "ISLAM MAKHACHEV" },
  fighters: [
    { rank: 1, name: "Islam Makhachev" },
    { rank: 2, name: "Ilia Topuria" },
    { rank: 3, name: "Khamzat Chimaev" },
    { rank: 4, name: "Alex Pereira" },
    { rank: 5, name: "Alexander Volkanovski" },
    { rank: 6, name: "Petr Yan" },
    { rank: 7, name: "Merab Dvalishvili" },
    { rank: 8, name: "Tom Aspinall" },
    { rank: 9, name: "Alexandre Pantoja" },
    { rank: 10, name: "Max Holloway" },
    { rank: 11, name: "Joshua Van", change: { direction: "up", positions: 1 } },
    { rank: 12, name: "Dricus Du Plessis", change: { direction: "down", positions: 1 } },
    { rank: 13, name: "Magomed Ankalaev" },
    { rank: 14, name: "Sean O'Malley" },
    { rank: 15, name: "Charles Oliveira" },
  ],
};

const topStrikers: RankingCategory = {
  title: "TOP STRIKERS",
  titleHighlight: "STRIKING RANK",
  champion: { name: "ALEX PEREIRA", nickname: "Poatan" },
  fighters: [
    { rank: 1, name: "Alex Pereira" },
    { rank: 2, name: "Ilia Topuria" },
    { rank: 3, name: "Max Holloway" },
    { rank: 4, name: "Justin Gaethje" },
    { rank: 5, name: "Sean O'Malley" },
    { rank: 6, name: "Israel Adesanya" },
    { rank: 7, name: "Dustin Poirier" },
    { rank: 8, name: "Jiri Prochazka" },
    { rank: 9, name: "Petr Yan" },
    { rank: 10, name: "Alexander Volkanovski" },
    { rank: 11, name: "Ciryl Gane" },
    { rank: 12, name: "Conor McGregor" },
    { rank: 13, name: "Jamahal Hill" },
    { rank: 14, name: "Cory Sandhagen" },
    { rank: 15, name: "Brandon Moreno" },
  ],
};

const topGrapplers: RankingCategory = {
  title: "TOP GRAPPLERS",
  titleHighlight: "GRAPPLING RANK",
  champion: { name: "ISLAM MAKHACHEV" },
  fighters: [
    { rank: 1, name: "Islam Makhachev" },
    { rank: 2, name: "Khamzat Chimaev" },
    { rank: 3, name: "Charles Oliveira" },
    { rank: 4, name: "Merab Dvalishvili" },
    { rank: 5, name: "Alexandre Pantoja" },
    { rank: 6, name: "Belal Muhammad" },
    { rank: 7, name: "Brandon Moreno" },
    { rank: 8, name: "Bo Nickal" },
    { rank: 9, name: "Sean Brady", change: { direction: "up", positions: 2 } },
    { rank: 10, name: "Arman Tsarukyan" },
    { rank: 11, name: "Demian Maia" },
    { rank: 12, name: "Gilbert Burns" },
    { rank: 13, name: "Mackenzie Dern" },
    { rank: 14, name: "Bryce Mitchell", change: { direction: "down", positions: 1 } },
    { rank: 15, name: "Ryan Hall" },
  ],
};

const RankingColumn = ({ category }: { category: RankingCategory }) => {
  return (
    <div className="flex-1 min-w-[280px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-primary text-xs font-bold tracking-wider">
            {category.title}
          </span>
          {category.titleHighlight && (
            <span className="text-foreground text-xs font-bold tracking-wider">
              {category.titleHighlight}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-black tracking-tight leading-tight">
          {category.champion.name}
        </h2>
        <p className="text-muted-foreground text-xs font-medium tracking-wider mt-1">
          CHAMPION
        </p>
      </div>

      {/* Champion placeholder image area */}
      <div className="h-32 bg-gradient-to-b from-muted to-transparent mb-4 rounded flex items-center justify-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">
            {category.champion.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>

      {/* Rankings list */}
      <div className="space-y-0">
        {category.fighters.map((fighter) => (
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
            {fighter.change && (
              <div className="flex items-center gap-1 text-xs">
                <span
                  className={
                    fighter.change.direction === "up"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {fighter.change.direction === "up" ? "▲" : "▼"}
                </span>
                <span className="text-muted-foreground">
                  {fighter.change.positions}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Rankings = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="sr-only">MMA Fighter Rankings</h1>

        {/* Rankings Grid - Similar to UFC layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <RankingColumn category={p4pRankings} />
          <RankingColumn category={topStrikers} />
          <RankingColumn category={topGrapplers} />
        </div>
      </div>
    </div>
  );
};

export default Rankings;