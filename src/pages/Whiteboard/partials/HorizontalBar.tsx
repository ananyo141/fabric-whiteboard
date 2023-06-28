import "./HorizontalBar.css";

import exportIcon from "../../../assets/export.png";
import importIcon from "../../../assets/import.png";
import undoIcon from "../../../assets/undo.png";
import redoIcon from "../../../assets/redo.png";
import penIcon from "../../../assets/pen.png";
import eraserIcon from "../../../assets/eraser.png";
import trashIcon from "../../../assets/trash.png";
import selectIcon from "../../../assets/select.png";
import downloadIcon from "../../../assets/download.png";

const HorizontalBar = ({
	handleUndo,
	handleRedo,
	clearBoard,
	deleteSelected,
	toggleDrawingMode,
	exportBoard,
	loadBoard,
	downloadBoard,
	isDrawing,
	canvasHistory,
	canvasHistoryIndex,
}) => {
  return (
    <div className="horizontal_bar">
      <div className="horizontal_button_wrapper">
        <button onClick={handleUndo} disabled={canvasHistoryIndex < 0}>
          <img src={undoIcon} alt="undo" />
        </button>
        <button
          onClick={handleRedo}
          disabled={canvasHistoryIndex === canvasHistory.current.length - 1}
        >
          <img src={redoIcon} alt="redo" />
        </button>
        <button onClick={clearBoard}>
          <img src={trashIcon} alt="clear" />
        </button>
        <button onClick={deleteSelected}>
          <img src={eraserIcon} alt="erase" />
        </button>
        <button onClick={toggleDrawingMode}>
          <img src={isDrawing ? penIcon : selectIcon} alt="pen" />
        </button>
        <button onClick={exportBoard}>
          <img src={exportIcon} alt="export" />
        </button>
        <button onClick={loadBoard}>
          <img src={importIcon} alt="load" />
        </button>
        <button onClick={downloadBoard}>
          <img src={downloadIcon} alt="download" />
        </button>
      </div>
    </div>
  );
};

export default HorizontalBar;
