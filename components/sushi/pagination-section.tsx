import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useFilterStore } from '@/store/filter.store';

interface PaginationSectionProps {
  totalItems: number;
}

export default function PaginationSection({
  totalItems,
}: PaginationSectionProps) {
  const { currentPage, itemsPerPage, setCurrentPage } = useFilterStore();

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p
        data-testid="pagination-info"
        className="text-muted-foreground text-sm"
      >
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{' '}
        {totalItems} items
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              data-testid="prev-page"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    data-testid={`page-${page}`}
                    data-active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis data-testid="pagination-ellipsis" />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              data-testid="next-page"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
