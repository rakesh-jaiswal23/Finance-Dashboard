import { useEffect, useMemo, useState } from "react";

export default function usePagination(items, pageSize, resetDeps = []) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, resetDeps);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    prevPage: () => setCurrentPage((p) => Math.max(1, p - 1)),
    nextPage: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
  };
}
