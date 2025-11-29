import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AppHeader = () => {
  return (
    <header className="bg-sidebar group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear">
      <h2 className="text-center text-base font-bold text-sky-500 md:hidden">
        Li2
      </h2>
      <p className="text-sm font-semibold md:text-xl">Sushi Manager</p>
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback className="text-xs">NA</AvatarFallback>
        </Avatar>
        <p className="text-xs">User</p>
      </div>
    </header>
  );
};

export default AppHeader;
