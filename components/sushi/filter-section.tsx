import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useFilterStore } from '@/store/filter.store';
import { T_SushiType } from '@/types/sushi.types';
import { SearchIcon } from 'lucide-react';

export default function FilterSection() {
  const {
    searchQuery,
    typeFilter,
    priceRange,
    priceSort,
    nameSort,
    setSearchQuery,
    setTypeFilter,
    setPriceRange,
    setPriceSort,
    setNameSort,
  } = useFilterStore();

  return (
    <section className="filters-section flex flex-wrap items-center gap-2">
      <div className="lg:min-w-sm min-w-[180px] flex-1">
        <Input
          startIcon={SearchIcon}
          data-testid="search-input"
          placeholder="Search by name or fish type..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
        <Select
          value={typeFilter}
          onValueChange={(value: T_SushiType) => setTypeFilter(value)}
        >
          <SelectTrigger data-testid="type-filter">
            <span>
              Type:{' '}
              {typeFilter === 'all'
                ? 'All'
                : typeFilter === 'Nigiri'
                  ? 'Nigiri'
                  : 'Roll'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Nigiri">Nigiri</SelectItem>
            <SelectItem value="Roll">Roll</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          value={priceSort}
          onValueChange={(value: 'none' | 'asc' | 'desc') =>
            setPriceSort(value)
          }
        >
          <SelectTrigger data-testid="price-sort">
            <span>
              Price:{' '}
              {priceSort === 'none'
                ? 'None'
                : priceSort === 'asc'
                  ? 'Low to High'
                  : 'High to Low'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="asc">Low to High</SelectItem>
            <SelectItem value="desc">High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          value={nameSort}
          onValueChange={(value: 'none' | 'asc' | 'desc') => setNameSort(value)}
        >
          <SelectTrigger data-testid="name-sort">
            <span>
              Name:{' '}
              {nameSort === 'none'
                ? 'None'
                : nameSort === 'asc'
                  ? 'A-Z'
                  : 'Z-A'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <div className="w-[250px]">
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
      </div> */}
    </section>
  );
}
