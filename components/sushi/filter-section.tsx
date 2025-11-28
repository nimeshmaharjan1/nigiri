import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilterStore } from '@/store/filter.store';
import { T_SushiType } from '@/types/sushi.types';
import { SearchIcon } from 'lucide-react';

export default function FilterSection() {
  const { searchQuery, typeFilter, setSearchQuery, setTypeFilter } =
    useFilterStore();

  return (
    <section className="flex flex-1 items-center gap-3">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          data-testid="search-input"
          placeholder="Search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={typeFilter}
        onValueChange={(value: T_SushiType) => setTypeFilter(value)}
      >
        <SelectTrigger data-testid="type-filter" className="w-[140px]">
          <span className="text-sm text-gray-600">Type:</span>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Nigiri">Nigiri</SelectItem>
          <SelectItem value="Roll">Roll</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px]">
          <span className="text-sm text-gray-600">Price:</span>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="low">$ - Low</SelectItem>
          <SelectItem value="medium">$$ - Medium</SelectItem>
          <SelectItem value="high">$$$ - High</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
}
