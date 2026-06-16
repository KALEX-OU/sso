import React from "react";
import styles from "./BaseModuleLayout.module.css";

interface BaseModuleLayoutProps {
  isLoading?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const BaseModuleLayout: React.FC<BaseModuleLayoutProps> = ({
  isLoading = false,
  error,
  children,
  className = ""
}) => {
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <h3 className={styles.errorTitle}>Si è verificato un errore</h3>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Caricamento modulo in corso...</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
