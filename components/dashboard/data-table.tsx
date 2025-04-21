"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
  render?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  title: string;
  data: T[];
  total: number;
  columns: Column<T>[];
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  page: number;
  limit: number;
};

export function DataTable<T>({
  title,
  data,
  total,
  columns,
  filters = [],
  onPageChange,
  onFilterChange,
  page,
  limit,
}: DataTableProps<T>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce(
      (acc, f) => ({ ...acc, [f.key]: f.options[0]?.value || "" }),
      {},
    ),
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    onFilterChange({ ...filterValues, search: searchQuery });
  }, [filterValues, searchQuery]);

  const resetFilters = () => {
    setFilterValues(
      filters.reduce(
        (acc, f) => ({ ...acc, [f.key]: f.options[0]?.value || "" }),
        {},
      ),
    );
    setSearchQuery("");
  };

  const totalPages = Math.ceil(total / limit);
  const isFiltered =
    searchQuery ||
    filters.some((f) => filterValues[f.key] !== f.options[0]?.value);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-xl",
        "border border-gray-200 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800",
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-0 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 rounded-lg px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-4">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key]}
                onValueChange={(value) =>
                  setFilterValues((prev) => ({ ...prev, [filter.key]: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            {isFiltered && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X />
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full min-w-[800px]">
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent dark:border-gray-700">
                {columns.map((column) => (
                  <TableHead
                    key={column.header}
                    className="py-4 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      "transition-colors duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30",
                      "border-b border-gray-100 last:border-0 dark:border-gray-800",
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.header}
                        className="py-4 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {column.render
                          ? column.render(item)
                          : typeof column.accessor === "function"
                            ? column.accessor(item)
                            : (item[column.accessor as keyof T] as
                                | string
                                | number)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {total > 0
              ? `Showing ${(page - 1) * limit + 1} to ${Math.min(
                  page * limit,
                  total,
                )} of ${total} entries`
              : "Showing 0 to 0 of 0 entries"}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
