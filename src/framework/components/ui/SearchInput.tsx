import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Cerca...",
  delay = 300,
  className = ""
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const isFirstRender = useRef(true);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onChange(localValue);
    }, delay);
    return () => clearTimeout(timer);
  }, [localValue, onChange, delay]);

  return (
    <div className={`${styles.container} ${className}`}>
      <Search className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
};
