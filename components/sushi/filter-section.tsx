import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useFilterStore } from '@/store/filter.store';
import { T_SushiType } from '@/types/sushi.types';

export default function FilterSection() {
  const {
    searchQuery,
    typeFilter,
    priceRange,
    setSearchQuery,
    setTypeFilter,
    setPriceRange,
  } = useFilterStore();

  return (
    <section className="filters-section flex flex-wrap items-center gap-4">
      <div className="min-w-[200px] flex-1">
        <label className="mb-2 block text-sm font-medium">Search</label>
        <Input
          data-testid="search-input"
          placeholder="Search by name or fish type..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-[180px]">
        <label className="mb-2 block text-sm font-medium">Type</label>
        <Select
          value={typeFilter}
          onValueChange={(value: T_SushiType) => setTypeFilter(value)}
        >
          <SelectTrigger data-testid="type-filter">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Nigiri">Nigiri</SelectItem>
            <SelectItem value="Roll">Roll</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-[250px]">
        <label className="mb-2 block text-sm font-medium">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider
          data-testid="price-slider"
          min={0}
          max={100}
          step={5}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mt-2"
        />
      </div>
    </section>
  );
}
