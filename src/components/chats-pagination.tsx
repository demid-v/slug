import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";
import { pagination } from "~/utils";
import { cn } from "~/utils/classes";

const ChatsPagination = ({
  page = 1,
  limit = 40,
  chatsCount,
}: {
  page: number | undefined;
  limit: number | undefined;
  chatsCount: number;
}) => {
  const paginationRange = pagination({
    totalCount: chatsCount ?? 0,
    limit,
    currentPage: page,
  });

  if (paginationRange.length < 2) {
    return null;
  }

  const lastPage = paginationRange.at(-1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`/chats?page=${page - 1}&limit=${limit}`}
            className={cn(page === 1 && "pointer-events-none")}
          />
        </PaginationItem>
        {paginationRange.map((pageNumber, index) =>
          pageNumber === "DOTS" ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                href={`/chats?page=${pageNumber}&limit=${limit}`}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={`/chats?page=${page + 1}&limit=${limit}`}
            className={cn(page === lastPage && "pointer-events-none")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ChatsPagination;
