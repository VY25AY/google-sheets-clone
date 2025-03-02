import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Toolbar from './components/Toolbar';
import styles from './styles/App.module.css';
import { evaluateCell } from './utils/spreadsheetFunctions';

const INITIAL_ROWS = 100;
const INITIAL_COLS = 26;

const App: React.FC = () => {
  // Initialize empty grid data
  const [data, setData] = useState<string[][]>(
    Array(INITIAL_ROWS).fill(null).map(() => Array(INITIAL_COLS).fill(''))
  );

  // Cell styles for formatting
  const [cellStyles, setCellStyles] = useState<React.CSSProperties[][]>(
    Array(INITIAL_ROWS).fill(null).map(() => Array(INITIAL_COLS).fill({}))
  );

  // Track selected cell
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Update formulas when data changes
  useEffect(() => {
    let hasChanges = false;
    const newData = data.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell.startsWith('=')) {
          const result = evaluateCell(cell, data);
          if (result !== cell) {
            hasChanges = true;
            return cell; // Keep the formula in the data, but display the result
          }
        }
        return cell;
      })
    );

    if (hasChanges) {
      setData(newData);
    }
  }, [data]);

  // Handle cell value changes
  const handleCellChange = (row: number, col: number, value: string) => {
    console.log('Changing cell:', row, col, 'to value:', value);
    const newData = data.map((rowData, rowIndex) =>
      rowIndex === row
        ? rowData.map((cell, colIndex) => (colIndex === col ? value : cell))
        : rowData
    );
    console.log('New data:', newData);
    setData(newData);
  };

  // Handle cell style changes
  const handleStyleChange = (style: React.CSSProperties) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newStyles = cellStyles.map((rowStyles, rowIndex) =>
      rowIndex === row
        ? rowStyles.map((cellStyle, colIndex) =>
            colIndex === col ? { ...cellStyle, ...style } : cellStyle
          )
        : rowStyles
    );
    setCellStyles(newStyles);
  };

  // Handle adding/removing rows and columns
  const addRow = () => {
    setData([...data, Array(data[0].length).fill('')]);
    setCellStyles([...cellStyles, Array(data[0].length).fill({})]);
  };

  const deleteRow = () => {
    if (data.length <= 1) return;
    setData(data.slice(0, -1));
    setCellStyles(cellStyles.slice(0, -1));
  };

  const addColumn = () => {
    setData(data.map(row => [...row, '']));
    setCellStyles(cellStyles.map(row => [...row, {}]));
  };

  const deleteColumn = () => {
    if (data[0].length <= 1) return;
    setData(data.map(row => row.slice(0, -1)));
    setCellStyles(cellStyles.map(row => row.slice(0, -1)));
  };

  return (
    <div className={styles.app}>
      <Toolbar
        onStyleChange={handleStyleChange}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
        onAddColumn={addColumn}
        onDeleteColumn={deleteColumn}
      />
      <Grid
        data={data}
        onCellChange={handleCellChange}
        cellStyles={cellStyles}
        selectedCell={selectedCell}
        onCellSelect={(row, col) => setSelectedCell({ row, col })}
      />
    </div>
  );
};

export default App;
