
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
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
    <div className="flex items-center gap-2">
      {selectedCategory && (
        <Badge 
          variant="outline" 
          className="bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1"
        >
          {selectedCategory}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-blue-800" 
            onClick={() => onCategoryChange(null)} 
          />
        </Badge>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selectedCategory ? "Change Filter" : "Filter by Category"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/95 backdrop-blur-md border-white/20">
          {categories.map((category) => (
            <DropdownMenuItem 
              key={category}
              className="cursor-pointer"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoryFilter;
