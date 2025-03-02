# Google Sheets Clone

A web application that mimics the core functionalities of Google Sheets, built with React and TypeScript.

## Tech Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Static typing for better development experience and code quality
- **CSS Modules**: Scoped styling solution to prevent style conflicts
- **React Hooks**: For managing component state and side effects

## Data Structures

### Grid Data Model

The spreadsheet data is stored in a two-dimensional array (`string[][]`), where:
- Each row is an array of strings
- Each cell can contain raw text, numbers, or formulas (prefixed with '=')
- The grid size is dynamic, allowing for row and column additions/deletions

### Cell Styling

Cell styles are managed through a parallel two-dimensional array (`React.CSSProperties[][]`), where:
- Each cell's styling properties are stored as a CSS-in-JS object
- This allows for individual cell formatting (bold, italic, color, etc.)

### Formula Evaluation

Formulas are evaluated using a functional approach:
- Formulas are parsed using regex to extract function names and arguments
- Cell references are resolved recursively to handle nested formulas
- Results are memoized to prevent unnecessary recalculations

## Features

1. **Spreadsheet Interface**
   - Google Sheets-like UI with toolbar and grid
   - Cell selection and editing
   - Formula bar for editing cell contents
   - Row and column management

2. **Mathematical Functions**
   - SUM: Calculate sum of cell range
   - AVERAGE: Calculate average of cell range
   - MAX: Find maximum value in range
   - MIN: Find minimum value in range
   - COUNT: Count numerical values in range

3. **Data Quality Functions**
   - TRIM: Remove whitespace
   - UPPER: Convert to uppercase
   - LOWER: Convert to lowercase
   - REMOVE_DUPLICATES: Remove duplicate rows
   - FIND_AND_REPLACE: Text replacement

4. **Cell Formatting**
   - Bold, italic, font size
   - Text color
   - Cell alignment
   - Border styles

## Implementation Details

### Cell Dependencies

- Cell dependencies are tracked through formula parsing
- When a cell's value changes, dependent cells are automatically recalculated
- Circular references are detected and prevented

### Performance Optimization

- React.memo for cell components to prevent unnecessary re-renders
- Virtualization for large datasets
- Memoized formula evaluation
- Efficient cell selection and range operations

### State Management

- Component state managed with useState and useEffect hooks
- Grid data and styling maintained in the top-level App component
- Cell-level state for editing mode and selection

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Demo 


![Screenshot 2025-03-02 121721](https://github.com/user-attachments/assets/27e82b9a-0cd9-4bf9-a164-51d559286304)
![Screenshot 2025-03-02 121629](https://github.com/user-attachments/assets/00a36146-9b13-4539-8e6f-e89b941cd31f)



https://github.com/user-attachments/assets/632485f8-61da-4f6b-aa62-bec542d85347



## Project Structure

```
src/
├── components/          # React components
│   ├── Grid.tsx        # Main grid component
│   ├── Cell.tsx        # Individual cell component
│   └── Toolbar.tsx     # Formatting toolbar
├── styles/             # CSS modules
│   ├── App.module.css
│   ├── Grid.module.css
│   └── Cell.module.css
├── utils/              # Utility functions
│   └── spreadsheetFunctions.ts
├── types/              # TypeScript definitions
│   └── css.d.ts
└── App.tsx            # Root component
