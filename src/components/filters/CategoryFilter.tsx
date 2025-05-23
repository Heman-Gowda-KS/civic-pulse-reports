
import { Button } from "@/components/ui/button";
import { CheckIcon, FilterIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportCategory } from "@/types/schema";

interface CategoryFilterProps {
  selectedCategory: ReportCategory | null;
  onCategoryChange: (category: string | null) => void;
}

const categories: ReportCategory[] = [
  "Traffic",
  "Road Damage",
  "Water Drainage",
  "Fallen Tree",
  "Street Light Issue",
  "Under Maintenance",
  "Garbage Dumping",
  "Illegal Parking",
  "Other"
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span>{selectedCategory || "All Categories"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedCategory === null}
          onCheckedChange={() => onCategoryChange(null)}
        >
          All Categories
          {selectedCategory === null && <CheckIcon className="h-4 w-4 ml-auto" />}
        </DropdownMenuCheckboxItem>
        
        {categories.map((category) => (
          <DropdownMenuCheckboxItem
            key={category}
            checked={selectedCategory === category}
            onCheckedChange={() => onCategoryChange(category)}
          >
            {category}
            {selectedCategory === category && <CheckIcon className="h-4 w-4 ml-auto" />}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryFilter;
