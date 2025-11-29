import SushiCard from '@/components/sushi/list-card';
import { useFilterStore } from '@/store/filter.store';
import { T_Sushi } from '@/types/sushi.types';
import { motion } from 'motion/react';
import { useMemo } from 'react';

interface SushiGridProps {
  sushiList: T_Sushi[];
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

  // Sort the filtered list
  const sortedSushiList = useMemo(() => {
    const sorted = [...filteredSushiList];

    // Apply price sort
    if (priceSort !== 'none') {
      sorted.sort((a, b) => {
        const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, ''));
        const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, ''));
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    // Apply name sort (takes precedence if both are set)
    if (nameSort !== 'none') {
      sorted.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (nameSort === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    return sorted;
  }, [filteredSushiList, priceSort, nameSort]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSushiList = sortedSushiList.slice(startIndex, endIndex);

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
