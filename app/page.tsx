'use client';
import FilterSection from '@/components/sushi/filter-section';
import SushiGrid from '@/components/sushi/sushi-grid';
import { RippleButton } from '@/components/ui/ripple-button';
import useGetAllSushi from '@/hooks/sushi/use-get-all-sushi.hook';
import { PlusIcon } from 'lucide-react';

import AddSushiDialog from '@/components/sushi/add';
import { useState } from 'react';
import Loading from './loading';

export default function HomePage() {
  const sushiListQuery = useGetAllSushi({});
  const sushiList = sushiListQuery.data || [];

  const [showAddDialog, setShowAddDialog] = useState(false);

  if (sushiListQuery.isLoading) return <Loading />;

  return (
    <div className="wrapper flex flex-col gap-6">
      <header className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Sushi Manager</h1>
        <FilterSection />
        <RippleButton
          data-testid="add-sushi-button"
          onClick={() => setShowAddDialog(true)}
          className="ml-auto"
        >
          <PlusIcon className="h-4 w-4" /> Add
        </RippleButton>
        <AddSushiDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </header>
      <SushiGrid sushiList={sushiList} />
    </div>
  );
}
