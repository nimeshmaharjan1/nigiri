import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AppHeader = () => {
  return (
    <header className="bg-sidebar group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear">
      <p className="text-xl font-semibold">Sushi Manager</p>
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
