import React from 'react';
import Cell from './Cell';
import styles from '../styles/Grid.module.css';

interface GridProps {
  data: string[][];
  onCellChange: (row: number, col: number, value: string) => void;
  cellStyles: React.CSSProperties[][];
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({
  data,
  onCellChange,
  cellStyles,
  selectedCell,
  onCellSelect,
}) => {
  // Generate column headers (A, B, C, etc.)
  const columnHeaders = Array.from({ length: data[0].length }, (_, i) =>
    String.fromCharCode('A'.charCodeAt(0) + i)
  );

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {/* Corner cell */}
        <div className={`${styles.cell} ${styles.cornerHeader}`} />

        {/* Column headers */}
        {columnHeaders.map((header, i) => (
          <div key={`col-${i}`} className={`${styles.cell} ${styles.columnHeader}`}>
            {header}
          </div>
        ))}

        {/* Row headers and data cells */}
        {data.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {/* Row header */}
            <div className={`${styles.cell} ${styles.rowHeader}`}>
              {rowIndex + 1}
            </div>

            {/* Data cells */}
            {row.map((cellValue, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                value={cellValue}
                onChange={(value) => onCellChange(rowIndex, colIndex, value)}
                style={cellStyles[rowIndex][colIndex]}
                isSelected={
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                }
                onSelect={() => onCellSelect(rowIndex, colIndex)}
                data={data}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Grid);
