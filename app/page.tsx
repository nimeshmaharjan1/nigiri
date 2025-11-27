'use client';
import SushiCard from '@/components/sushi/list-card';
import { Input } from '@/components/ui/input';
import { RippleButton } from '@/components/ui/ripple-button';
import useGetAllSushi from '@/hooks/sushi/use-get-all-sushi.hook';
import { PlusIcon } from 'lucide-react';
import { motion } from 'motion/react';

import Loading from './loading';

export default function HomePage() {
  const sushiListQuery = useGetAllSushi({});
  if (sushiListQuery.isLoading) return <Loading></Loading>;
  const sushiList = sushiListQuery.data;
  return (
    <div className="wrapper flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <section className="filters-section">
          <Input placeholder="Search..." type="search"></Input>
        </section>
        <section className="add-section">
          <RippleButton>
            <PlusIcon></PlusIcon> Add Item
          </RippleButton>
        </section>
      </header>
      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sushiList?.map((sushi, index) => (
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
    </div>
  );
}
