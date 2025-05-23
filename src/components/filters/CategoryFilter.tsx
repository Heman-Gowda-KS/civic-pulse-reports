
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Traffic": "hover:bg-red-50 hover:border-red-300 data-[selected=true]:bg-red-100 data-[selected=true]:border-red-300 data-[selected=true]:text-red-800",
      "Road Damage": "hover:bg-orange-50 hover:border-orange-300 data-[selected=true]:bg-orange-100 data-[selected=true]:border-orange-300 data-[selected=true]:text-orange-800",
      "Water Drainage": "hover:bg-blue-50 hover:border-blue-300 data-[selected=true]:bg-blue-100 data-[selected=true]:border-blue-300 data-[selected=true]:text-blue-800",
      "Fallen Tree": "hover:bg-green-50 hover:border-green-300 data-[selected=true]:bg-green-100 data-[selected=true]:border-green-300 data-[selected=true]:text-green-800",
      "Street Light Issue": "hover:bg-yellow-50 hover:border-yellow-300 data-[selected=true]:bg-yellow-100 data-[selected=true]:border-yellow-300 data-[selected=true]:text-yellow-800",
      "Under Maintenance": "hover:bg-purple-50 hover:border-purple-300 data-[selected=true]:bg-purple-100 data-[selected=true]:border-purple-300 data-[selected=true]:text-purple-800",
      "Garbage Dumping": "hover:bg-gray-50 hover:border-gray-300 data-[selected=true]:bg-gray-100 data-[selected=true]:border-gray-300 data-[selected=true]:text-gray-800",
      "Illegal Parking": "hover:bg-pink-50 hover:border-pink-300 data-[selected=true]:bg-pink-100 data-[selected=true]:border-pink-300 data-[selected=true]:text-pink-800",
      "Other": "hover:bg-indigo-50 hover:border-indigo-300 data-[selected=true]:bg-indigo-100 data-[selected=true]:border-indigo-300 data-[selected=true]:text-indigo-800"
    };
    return colors[category] || "hover:bg-gray-50 hover:border-gray-300";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filter by category:</span>
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryChange(null)}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            data-selected={selectedCategory === category}
            onClick={() => onCategoryChange(selectedCategory === category ? null : category)}
            className={`text-xs transition-all duration-200 border ${getCategoryColor(category)}`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
