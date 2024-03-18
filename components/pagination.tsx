import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

  interface PaginationProps {
    currentPage: number;
    totalPage: number;
    setPage: (val: number) => void;
  }
  
  export function PaginationComponent({currentPage, totalPage, setPage}: PaginationProps) {

    const handleNext = () => {
      if(currentPage < totalPage) {
        setPage(currentPage + 1)
      }
    }

    const handlePrev = () => {
      if(currentPage > 1) {
        setPage(currentPage - 1)
      }
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePrev} />
          </PaginationItem>
            {[...Array(totalPage)].map((_, i) => (
                <PaginationLink key={i} onClick={() => setPage(i+1)} isActive={i+1 === currentPage}>{i+1}</PaginationLink>
            ))}
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext onClick={handleNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }
  