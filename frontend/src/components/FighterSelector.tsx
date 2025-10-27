import { Fighter } from "@/pages/Index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FighterSelectorProps {
  weightClass: string;
  selectedFighter: Fighter | null;
  onFighterSelect: (fighter: Fighter) => void;
  excludeFighter?: Fighter | null;
}

// Mock fighter data - in real app this would come from your database
const mockFighters: Record<string, Fighter[]> = {
  lightweight: [
    {
      id: "1",
      name: "Charles Oliveira",
      nickname: "Do Bronx",
      record: "34-10-0",
      image: "/placeholder-fighter.jpg",
      wins: 34,
      losses: 10,
      last5: "WWWWL",
      slpm: 3.86,
      strAcc: 0.44,
      sapm: 3.29,
      strDef: 0.58,
      tdAvg: 2.74,
      tdAcc: 0.43,
      tdDef: 0.83,
      subAvg: 1.8,
      kdAvg: 0.6,
      ranking: 2,
      height: 70,
      reach: 74,
      subs: 21
    },
    {
      id: "2", 
      name: "Islam Makhachev",
      nickname: "",
      record: "25-1-0",
      image: "/placeholder-fighter.jpg",
      wins: 25,
      losses: 1,
      last5: "WWWWW",
      slpm: 2.85,
      strAcc: 0.51,
      sapm: 2.12,
      strDef: 0.68,
      tdAvg: 4.54,
      tdAcc: 0.55,
      tdDef: 0.91,
      subAvg: 0.8,
      kdAvg: 0.2,
      ranking: 1,
      height: 70,
      reach: 70,
      subs: 4
    },
    {
      id: "3",
      name: "Justin Gaethje",
      nickname: "The Highlight",
      record: "24-5-0",
      image: "/placeholder-fighter.jpg",
      wins: 24,
      losses: 5,
      last5: "LWWLW",
      slpm: 7.08,
      strAcc: 0.57,
      sapm: 4.85,
      strDef: 0.61,
      tdAvg: 0.72,
      tdAcc: 0.31,
      tdDef: 0.85,
      subAvg: 0.1,
      kdAvg: 1.2,
      ranking: 3,
      height: 69,
      reach: 71,
      subs: 1
    }
  ],
  welterweight: [
    {
      id: "4",
      name: "Leon Edwards",
      nickname: "Rocky",
      record: "22-3-0",
      image: "/placeholder-fighter.jpg",
      wins: 22,
      losses: 3,
      last5: "WWWWW",
      slpm: 3.75,
      strAcc: 0.48,
      sapm: 2.89,
      strDef: 0.64,
      tdAvg: 0.98,
      tdAcc: 0.36,
      tdDef: 0.78,
      subAvg: 0.2,
      kdAvg: 0.4,
      ranking: 1,
      height: 72,
      reach: 74,
      subs: 2
    },
    {
      id: "5",
      name: "Colby Covington",
      nickname: "Chaos",
      record: "17-4-0",
      image: "/placeholder-fighter.jpg",
      wins: 17,
      losses: 4,
      last5: "LWWLW",
      slpm: 4.31,
      strAcc: 0.42,
      sapm: 2.78,
      strDef: 0.66,
      tdAvg: 4.87,
      tdAcc: 0.45,
      tdDef: 0.84,
      subAvg: 0.1,
      kdAvg: 0.3,
      ranking: 2,
      height: 70,
      reach: 72,
      subs: 1
    }
  ]
};

export const FighterSelector = ({ weightClass, selectedFighter, onFighterSelect, excludeFighter }: FighterSelectorProps) => {
  const fighters = mockFighters[weightClass] || [];
  const availableFighters = fighters.filter(f => f.id !== excludeFighter?.id);

  return (
    <Select 
      value={selectedFighter?.id || ""} 
      onValueChange={(value) => {
        const fighter = availableFighters.find(f => f.id === value);
        if (fighter) onFighterSelect(fighter);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select fighter" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {availableFighters.length === 0 ? (
          <SelectItem value="none" disabled>
            No fighters available
          </SelectItem>
        ) : (
          availableFighters.map((fighter) => (
            <SelectItem key={fighter.id} value={fighter.id}>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{fighter.name}</span>
                {fighter.nickname && (
                  <span className="text-primary text-sm">"{fighter.nickname}"</span>
                )}
                <span className="text-muted-foreground text-sm">({fighter.record})</span>
                {fighter.ranking && (
                  <span className="text-xs bg-primary/20 px-1 rounded">#{fighter.ranking}</span>
                )}
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};