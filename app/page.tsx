'use client';
import FilterSection from '@/components/sushi/filter-section';
import PaginationSection from '@/components/sushi/pagination-section';
import SushiGrid, { useFilteredCount } from '@/components/sushi/sushi-grid';
import { RippleButton } from '@/components/ui/ripple-button';
import useGetAllSushi from '@/hooks/sushi/use-get-all-sushi.hook';
import { PlusIcon } from 'lucide-react';

import AddSushiDialog from '@/components/sushi/add';
import { useState } from 'react';
import Loading from './loading';

export default function HomePage() {
  const sushiListQuery = useGetAllSushi({});
  const sushiList = sushiListQuery.data || [];
  const filteredCount = useFilteredCount(sushiList);

  const [showAddDialog, setShowAddDialog] = useState(false);

  if (sushiListQuery.isLoading) return <Loading />;

  return (
    <div className="wrapper flex flex-col">
      <header className="flex flex-col items-start gap-4 border-b bg-white p-4 md:flex-row md:justify-between">
        <FilterSection />
        <div className="flex items-center justify-between gap-4 md:justify-end">
          <RippleButton
            data-testid="add-sushi-button"
            onClick={() => setShowAddDialog(true)}
          >
            <PlusIcon /> Add
          </RippleButton>
        </div>
        <AddSushiDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </header>
      <section className="flex flex-col gap-6 p-4">
        <SushiGrid sushiList={sushiList} />
        <PaginationSection totalItems={filteredCount} />
      </section>
    </div>
  );
}
