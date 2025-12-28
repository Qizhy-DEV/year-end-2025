import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";

interface SimplePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function SimplePagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: SimplePaginationProps) {
    if (totalPages <= 1) return null;

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={cn("flex items-center justify-center gap-2 mt-4", className)}>
            {/* Previous Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrevious}
                className="h-8 w-8 p-0"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => {
                if (page === "...") {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <Button
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className={cn(
                            "h-8 w-8 p-0",
                            isActive && "bg-primary text-primary-foreground"
                        )}
                    >
                        {pageNum}
                    </Button>
                );
            })}

            {/* Next Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className="h-8 w-8 p-0"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
