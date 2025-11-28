import SushiCard from '@/components/sushi/list-card';
import { useFilterStore } from '@/store/filter.store';
import { T_Sushi } from '@/types/sushi.types';
import { motion } from 'motion/react';
import { useMemo } from 'react';

interface SushiGridProps {
  sushiList: T_Sushi[];
}

export default function SushiGrid({ sushiList }: SushiGridProps) {
  const { searchQuery, typeFilter, priceRange } = useFilterStore();

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

  return (
    <main
      data-testid="sushi-grid"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {filteredSushiList?.map((sushi, index) => (
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
  );
}
