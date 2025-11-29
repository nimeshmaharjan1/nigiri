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
    <div className="flex w-full flex-wrap gap-4">
      {/* Search input - full width row on md */}
      <div className="w-full md:basis-full lg:max-w-xs lg:basis-auto">
        <Input
          startIcon={SearchIcon}
          data-testid="search-input"
          placeholder="Search by name or fish type..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter controls */}
      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
        <div className="w-full md:w-auto md:min-w-[140px]">
          <Select
            value={typeFilter}
            onValueChange={(value: T_SushiType) => setTypeFilter(value)}
          >
            <SelectTrigger data-testid="type-filter" className="w-full">
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
        <div className="w-full md:w-auto md:min-w-[140px]">
          <Select
            value={priceSort}
            onValueChange={(value: 'none' | 'asc' | 'desc') =>
              setPriceSort(value)
            }
          >
            <SelectTrigger data-testid="price-sort" className="w-full">
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
        <div className="w-full md:w-auto md:min-w-[140px]">
          <Select
            value={nameSort}
            onValueChange={(value: 'none' | 'asc' | 'desc') =>
              setNameSort(value)
            }
          >
            <SelectTrigger data-testid="name-sort" className="w-full">
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
      </div>
    </div>
  );
}
