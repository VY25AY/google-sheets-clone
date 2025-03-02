import React from 'react';
import styles from '../styles/Toolbar.module.css';

interface ToolbarProps {
  onStyleChange: (style: React.CSSProperties) => void;
  onAddRow: () => void;
  onDeleteRow: () => void;
  onAddColumn: () => void;
  onDeleteColumn: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onStyleChange,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
}) => {
  const handleBoldClick = () => {
    onStyleChange({ fontWeight: 'bold' });
  };

  const handleItalicClick = () => {
    onStyleChange({ fontStyle: 'italic' });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStyleChange({ fontSize: `${e.target.value}px` });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange({ color: e.target.value });
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.formatGroup}>
        <button
          className={styles.toolbarButton}
          onClick={handleBoldClick}
          title="Bold"
        >
          B
        </button>
        <button
          className={styles.toolbarButton}
          onClick={handleItalicClick}
          title="Italic"
        >
          I
        </button>
        <select
          className={styles.toolbarSelect}
          onChange={handleFontSizeChange}
          defaultValue="12"
        >
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="24">24</option>
        </select>
        <input
          type="color"
          className={styles.toolbarColor}
          onChange={handleColorChange}
          title="Text Color"
        />
      </div>

      <div className={styles.editGroup}>
        <button
          className={styles.toolbarButton}
          onClick={onAddRow}
          title="Add Row"
        >
          Add Row
        </button>
        <button
          className={styles.toolbarButton}
          onClick={onDeleteRow}
          title="Delete Row"
        >
          Delete Row
        </button>
        <button
          className={styles.toolbarButton}
          onClick={onAddColumn}
          title="Add Column"
        >
          Add Column
        </button>
        <button
          className={styles.toolbarButton}
          onClick={onDeleteColumn}
          title="Delete Column"
        >
          Delete Column
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
