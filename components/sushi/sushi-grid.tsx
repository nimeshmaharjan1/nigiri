import SushiCard from '@/components/sushi/list-card';
import { useFilterStore } from '@/store/filter.store';
import { T_Sushi } from '@/types/sushi.types';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { SearchX, UtensilsCrossed } from 'lucide-react';

interface SushiGridProps {
  sushiList: T_Sushi[];
}

function EmptyState({
  hasFilters,
  searchQuery,
}: {
  hasFilters: boolean;
  searchQuery: string;
}) {
  if (hasFilters || searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="bg-muted mb-4 rounded-full p-4">
          <SearchX className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">No results found</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {searchQuery
            ? `No sushi found matching "${searchQuery}". Try a different search term or adjust your filters.`
            : 'No sushi found matching your filters. Try adjusting your filter criteria.'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="bg-muted mb-4 rounded-full p-4">
        <UtensilsCrossed className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold">No sushi yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Get started by adding your first sushi item using the Add button above.
      </p>
    </motion.div>
  );
}

export default function SushiGrid({ sushiList }: SushiGridProps) {
  const {
    searchQuery,
    typeFilter,
    priceRange,
    priceSort,
    nameSort,
    currentPage,
    itemsPerPage,
  } = useFilterStore();

  // Filter the sushi list based on all filters
  const filteredSushiList = useMemo(() => {
    if (!sushiList) {
      return [];
    }

    const filtered = sushiList.filter((sushi) => {
      // Search filter with null checks
      const matchesSearch =
        searchQuery === '' ||
        sushi.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sushi.fishType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      // Type filter with null check
      const matchesType = typeFilter === 'all' || sushi.type === typeFilter;

      // Price filter with null checks and safe parsing
      const priceString = sushi.price || '0';
      const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
      const matchesPrice =
        !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];

      const passes = matchesSearch && matchesType && matchesPrice;

      return passes;
    });

    return filtered;
  }, [sushiList, searchQuery, typeFilter, priceRange]);

  // Sort the filtered list - only one sort can be active at a time
  const sortedSushiList = useMemo(() => {
    const sorted = [...filteredSushiList];

    console.log('=== SORT DEBUG ===');
    console.log('priceSort:', priceSort);
    console.log('nameSort:', nameSort);

    // Apply name sort first (if active, it takes priority)
    if (nameSort !== 'none') {
      console.log('Applying NAME sort');
      sorted.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (nameSort === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    } else if (priceSort !== 'none') {
      console.log('Applying PRICE sort');
      // Apply price sort only if name sort is not active
      sorted.sort((a, b) => {
        const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, ''));
        const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, ''));
        console.log(
          `Comparing: ${a.name} ($${priceA}) vs ${b.name} ($${priceB})`
        );
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else {
      console.log('No sort applied');
    }

    console.log(
      'Sorted result (first 5):',
      sorted.slice(0, 5).map((s) => ({ name: s.name, price: s.price }))
    );

    return sorted;
  }, [filteredSushiList, priceSort, nameSort]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSushiList = sortedSushiList.slice(startIndex, endIndex);

  // Check if any filters are active
  const hasActiveFilters =
    typeFilter !== 'all' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    priceSort !== 'none' ||
    nameSort !== 'none';

  // Show empty state if no items
  if (paginatedSushiList.length === 0) {
    return (
      <EmptyState hasFilters={hasActiveFilters} searchQuery={searchQuery} />
    );
  }

  return (
    <>
      <main
        data-testid="sushi-grid"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {paginatedSushiList?.map((sushi, index) => (
          <motion.div
            key={sushi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <SushiCard sushi={sushi} />
          </motion.div>
        ))}
      </main>
    </>
  );
}

// Export filtered count for pagination
export function useFilteredCount(sushiList: T_Sushi[]) {
  const { searchQuery, typeFilter, priceRange } = useFilterStore();

  return useMemo(() => {
    if (!sushiList) return 0;

    return sushiList.filter((sushi) => {
      const matchesSearch =
        searchQuery === '' ||
        sushi.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sushi.fishType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      const matchesType = typeFilter === 'all' || sushi.type === typeFilter;

      const priceString = sushi.price || '0';
      const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
      const matchesPrice =
        !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    }).length;
  }, [sushiList, searchQuery, typeFilter, priceRange]);
}
