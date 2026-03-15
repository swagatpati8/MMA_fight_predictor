import { Fighter } from "@/pages/Index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FighterSelectorProps {
  fighters: Fighter[];
  selectedFighter: Fighter | null;
  onFighterSelect: (fighter: Fighter) => void;
  excludeFighter?: Fighter | null;
}

export const FighterSelector = ({ fighters, selectedFighter, onFighterSelect, excludeFighter }: FighterSelectorProps) => {
  const availableFighters = fighters.filter(f => f.id !== excludeFighter?.id);

  return (
    <Select
      value={selectedFighter?.id?.toString() || ""}
      onValueChange={(value) => {
        const fighter = availableFighters.find(f => f.id.toString() === value);
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
            <SelectItem key={fighter.id} value={fighter.id.toString()}>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{fighter.name}</span>
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
