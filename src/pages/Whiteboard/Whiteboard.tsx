import "./Whiteboard.css";

import React from "react";
import { fabric } from "fabric";

import { useBoardHandlers } from "./boardHandlers";
import HorizontalBar from "./partials/HorizontalBar";
import VerticalToolbar from "./partials/VerticalToolbar";

const Board = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasBg = React.useRef("#FFFFFF");
  const [penWidth, setPenWidth] = React.useState(3);
  const [penColor, setPenColor] = React.useState("#000000");
  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas>();
  const [isDrawing, setIsDrawing] = React.useState(true);
  const [widthOpen, setWidthOpen] = React.useState(false);

  const canvasHistory = React.useRef([]);
  const [canvasHistoryIndex, setCanvasHistoryIndex] = React.useState(-1);

  const {
    enableEventListeners,
    disableEventListeners,
    deleteSelected,
    handleUndo,
    handleRedo,
    downloadBoard,
    clearBoard,
    exportBoard,
    loadBoard,
    drawCircle,
    drawArrow,
    drawRect,
    addText,
    toggleDrawingMode,
    changePenColor,
    changePenWidth,
  } = useBoardHandlers({
    fabricCanvas,
    canvasBg,
    canvasHistory,
    canvasHistoryIndex,
    setCanvasHistoryIndex,
    setPenWidth,
    penColor,
    setPenColor,
    setIsDrawing,
  });

  React.useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 10,
      height: window.innerHeight - 60,
      backgroundColor: canvasBg.current,
      isDrawingMode: true,
    });
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasRef]);

  React.useEffect(() => {
    if (!fabricCanvas) return;
    enableEventListeners();
    return () => disableEventListeners();
  }, [fabricCanvas, canvasHistory.current, canvasHistoryIndex]);

  return (
    <div className="wrapper">
      <canvas ref={canvasRef}></canvas>
      {/* Circle, Rectangle, Text, Arrow*/}
      {/* Horizontal */}
      <HorizontalBar
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        clearBoard={clearBoard}
        deleteSelected={deleteSelected}
        toggleDrawingMode={toggleDrawingMode}
        exportBoard={exportBoard}
        loadBoard={loadBoard}
        downloadBoard={downloadBoard}
        isDrawing={isDrawing}
        canvasHistory={canvasHistory}
        canvasHistoryIndex={canvasHistoryIndex}
      />
      {/* Vertical */}
      <VerticalToolbar
        drawCircle={drawCircle}
        drawRect={drawRect}
        addText={addText}
        drawArrow={drawArrow}
        penColor={penColor}
        changePenColor={changePenColor}
        penWidth={penWidth}
        changePenWidth={changePenWidth}
        widthOpen={widthOpen}
        setWidthOpen={setWidthOpen}
      />
    </div>
  );
};

export default Board;
