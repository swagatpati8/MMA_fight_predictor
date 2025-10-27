import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeightClassSelectorProps {
  selectedWeightClass: string;
  onWeightClassChange: (weightClass: string) => void;
}

const weightClasses = [
  { name: "Flyweight", weight: "125 lbs", id: "flyweight" },
  { name: "Bantamweight", weight: "135 lbs", id: "bantamweight" },
  { name: "Featherweight", weight: "145 lbs", id: "featherweight" },
  { name: "Lightweight", weight: "155 lbs", id: "lightweight" },
  { name: "Welterweight", weight: "170 lbs", id: "welterweight" },
  { name: "Middleweight", weight: "185 lbs", id: "middleweight" },
  { name: "Light Heavyweight", weight: "205 lbs", id: "lightheavyweight" },
  { name: "Heavyweight", weight: "265 lbs", id: "heavyweight" },
];

export const WeightClassSelector = ({ selectedWeightClass, onWeightClassChange }: WeightClassSelectorProps) => {
  return (
    <Select value={selectedWeightClass} onValueChange={onWeightClassChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select weight class" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {weightClasses.map((weightClass) => (
          <SelectItem key={weightClass.id} value={weightClass.id}>
            {weightClass.name} ({weightClass.weight})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};