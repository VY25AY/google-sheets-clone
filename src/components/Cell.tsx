import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from '../styles/Cell.module.css';
import { evaluateCell } from '../utils/spreadsheetFunctions';

interface CellProps {
  value: string;
  onChange: (value: string) => void;
  style: React.CSSProperties;
  isSelected: boolean;
  onSelect: () => void;
  data: string[][];
  rowIndex: number;
  colIndex: number;
}

const Cell: React.FC<CellProps> = ({
  value,
  onChange,
  style,
  isSelected,
  onSelect,
  data,
  rowIndex,
  colIndex,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate the display value
  const displayValue = useMemo(() => {
    if (value.startsWith('=')) {
      console.log('Evaluating formula:', value);
      const result = evaluateCell(value, data);
      console.log('Formula result:', result);
      return result;
    }
    return value;
  }, [value, data]);

  // Update edit value when value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isSelected && !isEditing) {
      setIsEditing(true);
    }
  }, [isSelected, isEditing]); // Added isEditing to dependencies

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editValue !== value) {
        onChange(editValue);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  return (
    <div
      className={`${styles.cell} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      style={style}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className={styles.cellInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className={styles.cellContent}>{displayValue}</div>
      )}
    </div>
  );
};

export default React.memo(Cell);
