import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalElements?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  totalElements
}) => {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = totalElements ? Math.min(currentPage * pageSize, totalElements) : currentPage * pageSize;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {totalElements !== undefined ? (
          <span>
            Mostrati <strong>{startRange}</strong>-<strong>{endRange}</strong> di <strong>{totalElements}</strong>
          </span>
        ) : (
          <span>Pagina <strong>{currentPage}</strong> di <strong>{totalPages}</strong></span>
        )}
      </div>

      <div className={styles.controls}>
        {onPageSizeChange && (
          <div className={styles.pageSizeWrapper}>
            <span className={styles.pageSizeLabel}>Righe per pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={styles.pageSizeSelect}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.buttons}>
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1}
              className={styles.button}
              aria-label="Pagina precedente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={styles.pageNumber}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className={styles.button}
              aria-label="Pagina successiva"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
