// Helper function to convert column letter to number (A -> 0, B -> 1, etc.)
const columnToNumber = (column: string): number => {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result *= 26;
    result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return result - 1;
};

// Helper function to parse cell reference (e.g., "A1" -> { row: 0, col: 0 })
const parseCellReference = (ref: string): { row: number; col: number } => {
  console.log('Parsing cell reference:', ref);
  const match = ref.match(/([A-Z]+)(\d+)/);
  if (!match) throw new Error(`Invalid cell reference: ${ref}`);
  
  const column = match[1];
  const row = parseInt(match[2]) - 1;
  const col = columnToNumber(column);
  
  console.log('Parsed cell reference:', { row, col });
  return { row, col };
};

// Helper function to get range of cells
const getCellRange = (start: string, end: string): { row: number; col: number }[] => {
  console.log('Getting cell range from', start, 'to', end);
  const startCell = parseCellReference(start);
  const endCell = parseCellReference(end);
  
  const cells: { row: number; col: number }[] = [];
  for (let row = startCell.row; row <= endCell.row; row++) {
    for (let col = startCell.col; col <= endCell.col; col++) {
      cells.push({ row, col });
    }
  }
  
  console.log('Cell range:', cells);
  return cells;
};

// Helper function to get cell value
const getCellValue = (cell: string, data: string[][]): number => {
  console.log('Getting cell value for:', cell);
  const { row, col } = parseCellReference(cell);
  if (row < 0 || row >= data.length || col < 0 || col >= data[0].length) {
    throw new Error(`Cell reference out of bounds: ${cell}`);
  }
  const value = data[row][col];
  console.log('Raw cell value:', value);
  
  if (!value || value.trim() === '') return 0;
  if (value.startsWith('=')) {
    const result = parseFunction(value, data);
    console.log('Evaluated formula result:', result);
    return isNaN(Number(result)) ? 0 : Number(result);
  }
  const numValue = Number(value);
  console.log('Numeric value:', numValue);
  return isNaN(numValue) ? 0 : numValue;
};

// Helper function to get range values
const getRangeValues = (range: string, data: string[][]): number[] => {
  try {
    console.log('Getting range values for:', range);
    const [start, end] = range.split(':');
    console.log('Start cell:', start, 'End cell:', end);
    const cells = getCellRange(start, end);
    console.log('Cells in range:', cells);
    
    const values = cells.map(({ row, col }) => {
      // Check bounds
      if (row >= data.length || col >= data[0].length || row < 0 || col < 0) {
        console.log(`Cell (${row},${col}) out of bounds`);
        return 0;
      }
      
      // Get cell value
      const value = data[row][col];
      console.log(`Cell (${row},${col}) value:`, value);
      
      // Handle empty cells
      if (!value || value.trim() === '') {
        console.log(`Empty cell at (${row},${col})`);
        return 0;
      }
      
      // Handle formulas
      if (value.startsWith('=')) {
        const result = parseFunction(value, data);
        const numResult = Number(result);
        console.log(`Formula result for cell (${row},${col}):`, numResult);
        return isNaN(numResult) ? 0 : numResult;
      }
      
      // Handle direct values
      const numValue = Number(value);
      console.log(`Numeric value for cell (${row},${col}):`, numValue);
      return isNaN(numValue) ? 0 : numValue;
    });
    
    console.log('Final range values:', values);
    return values;
  } catch (error) {
    console.error('Error getting range values:', error);
    return [0];
  }
};

// Mathematical Functions
const sum = (range: string, data: string[][]): number => {
  console.log('Calculating sum for range:', range);
  const values = getRangeValues(range, data);
  console.log('Values to sum:', values);
  const result = values.reduce((acc, val) => {
    console.log('Current sum:', acc, '+ value:', val);
    return acc + val;
  }, 0);
  console.log('Final sum result:', result);
  return result;
};

const average = (range: string, data: string[][]): number => {
  const values = getRangeValues(range, data);
  return values.reduce((acc, val) => acc + val, 0) / values.length;
};

const max = (range: string, data: string[][]): number => {
  const values = getRangeValues(range, data);
  return Math.max(...values);
};

const min = (range: string, data: string[][]): number => {
  const values = getRangeValues(range, data);
  return Math.min(...values);
};

const count = (range: string, data: string[][]): number => {
  const values = getRangeValues(range, data);
  return values.filter(val => !isNaN(val)).length;
};

// Data Quality Functions
const trim = (value: string): string => value.trim();

const upper = (value: string): string => value.toUpperCase();

const lower = (value: string): string => value.toLowerCase();

const removeDuplicates = (range: string, data: string[][]): string[][] => {
  const [start, end] = range.split(':');
  const startCell = parseCellReference(start);
  const endCell = parseCellReference(end);
  
  // Extract the rows in the range
  const rowsInRange = data.slice(startCell.row, endCell.row + 1);
  
  // Convert rows to strings for comparison and back to remove duplicates
  const uniqueRowsStr = Array.from(new Set(rowsInRange.map(row => JSON.stringify(row))));
  const uniqueRows = uniqueRowsStr.map(rowStr => JSON.parse(rowStr) as string[]);
  
  // Create new data array with unique rows
  return data.map((row, index) => {
    if (index >= startCell.row && index <= endCell.row) {
      return uniqueRows[index - startCell.row] || row;
    }
    return row;
  });
};

const findAndReplace = (range: string, find: string, replace: string, data: string[][]): string[][] => {
  const [start, end] = range.split(':');
  const cells = getCellRange(start, end);
  
  return data.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (cells.some(c => c.row === rowIndex && c.col === colIndex)) {
        return cell.replace(new RegExp(find, 'g'), replace);
      }
      return cell;
    })
  );
};

// Main function to parse and evaluate formulas
export const parseFunction = (formula: string, data: string[][]): string => {
  try {
    console.log('Parsing formula:', formula);
    if (!formula.startsWith('=')) return formula;
    
    const functionMatch = formula.match(/=([A-Z]+)\((.*)\)/);
    if (!functionMatch) {
      console.log('No function match found');
      return '#ERROR!';
    }
    
    const [_, functionName, args] = functionMatch;
    console.log('Function:', functionName, 'Arguments:', args);
    let result: string | number = '#ERROR!';
    
    switch (functionName.toUpperCase()) {
      case 'SUM': {
        const value = sum(args, data);
        result = isNaN(value) ? '#ERROR!' : value;
        break;
      }
      case 'AVERAGE': {
        const value = average(args, data);
        result = isNaN(value) ? '#ERROR!' : value;
        break;
      }
      case 'MAX': {
        const value = max(args, data);
        result = isNaN(value) ? '#ERROR!' : value;
        break;
      }
      case 'MIN': {
        const value = min(args, data);
        result = isNaN(value) ? '#ERROR!' : value;
        break;
      }
      case 'COUNT': {
        const value = count(args, data);
        result = isNaN(value) ? '#ERROR!' : value;
        break;
      }
      case 'TRIM':
        result = trim(args);
        break;
      case 'UPPER':
        result = upper(args);
        break;
      case 'LOWER':
        result = lower(args);
        break;
      default:
        result = '#ERROR!';
    }
    
    console.log('Function result:', result);
    return result.toString();
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
};

export const evaluateCell = (value: string, data: string[][]): string => {
  if (!value) return '';
  if (value.startsWith('=')) {
    console.log('Evaluating formula:', value);
    const result = parseFunction(value, data);
    console.log('Formula evaluation result:', result);
    return result;
  }
  return value;
};
