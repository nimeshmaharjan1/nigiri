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
    <div className="wrapper flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Menu</h1>
          <RippleButton
            data-testid="add-sushi-button"
            onClick={() => setShowAddDialog(true)}
          >
            <PlusIcon /> Add Item
          </RippleButton>
          <AddSushiDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
          />
        </div>
        <FilterSection />
      </header>
      <SushiGrid sushiList={sushiList} />
      <PaginationSection totalItems={filteredCount} />
    </div>
  );
}
