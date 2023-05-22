import React from "react";
import { fabric } from "fabric";

// icon imports
import exportIcon from "../assets/export.png";
import importIcon from "../assets/import.png";
import undoIcon from "../assets/undo.png";
import redoIcon from "../assets/redo.png";
import penIcon from "../assets/pen.png";
import eraserIcon from "../assets/eraser.png";
import trashIcon from "../assets/trash.png";
import selectIcon from "../assets/select.png";
import downloadIcon from "../assets/download.png";
import circleIcon from "../assets/circleC.png";
import rectangleIcon from "../assets/rectangleC.png";
import textIcon from "../assets/textC.png";
import arrowIcon from "../assets/arrowC.png";
import widthIcon from "../assets/width.png";

const Board = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasBg = React.useRef<string>("#F9F0F0");
  const [penWidth, setPenWidth] = React.useState(3);
  const [penColor, setPenColor] = React.useState("#000000");
  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas>();
  const [isDrawing, setIsDrawing] = React.useState(true);

  const [widthOpen, setWidthOpen] = React.useState(false);

  const canvasHistory = React.useRef<any>([]);
  const [canvasHistoryIndex, setCanvasHistoryIndex] =
    React.useState<number>(-1);

  React.useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
      width: window.innerWidth - 10,
      height: window.innerHeight - 110,
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

  const saveCanvasState = () => {
    if (!fabricCanvas) return;
    const state = fabricCanvas.toDatalessObject();
    const newObjects = canvasHistory.current.slice(0, canvasHistoryIndex + 1);
    newObjects.push(state);
    canvasHistory.current = newObjects;
    setCanvasHistoryIndex(canvasHistoryIndex + 1);
  };

  const enableEventListeners = () => {
    if (!fabricCanvas) return;
    fabricCanvas.on("object:added", saveCanvasState);
    fabricCanvas.on("object:modified", saveCanvasState);
    fabricCanvas.on("object:removed", saveCanvasState);
  };

  const disableEventListeners = () => {
    if (!fabricCanvas) return;
    fabricCanvas.off("object:added", saveCanvasState);
    fabricCanvas.off("object:modified", saveCanvasState);
    fabricCanvas.off("object:removed", saveCanvasState);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObjects();
    if (activeObject) {
      fabricCanvas.remove(...activeObject);
    }
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    if (canvasHistoryIndex > 0) {
      const state = canvasHistory.current[canvasHistoryIndex - 1];
      setCanvasHistoryIndex(canvasHistoryIndex - 1);
      disableEventListeners();
      fabricCanvas.loadFromJSON(state, () => {
        fabricCanvas.renderAll();
      });
      enableEventListeners();
    } else {
      disableEventListeners();
      clearBoard();
      enableEventListeners();
      setCanvasHistoryIndex(-1);
    }
  };

  const handleRedo = () => {
    if (!fabricCanvas) return;
    if (canvasHistoryIndex < canvasHistory.current.length - 1) {
      const state = canvasHistory.current[canvasHistoryIndex + 1];
      setCanvasHistoryIndex(canvasHistoryIndex + 1);
      disableEventListeners();
      fabricCanvas.loadFromJSON(state, () => {
        fabricCanvas.renderAll();
      });
      enableEventListeners();
    }
  };

  const changePenWidth = (width: number) => {
    if (!fabricCanvas) return;
    fabricCanvas.freeDrawingBrush.width = width;
    setPenWidth(width);
    fabricCanvas.renderAll.bind(fabricCanvas);
  };

  const changePenColor = (color: string) => {
    if (!fabricCanvas) return;
    fabricCanvas.freeDrawingBrush.color = color;
    setPenColor(color);
    fabricCanvas.renderAll.bind(fabricCanvas);
  };

  const downloadBoard = () => {
    if (!fabricCanvas) return;
    const pngData = fabricCanvas.toDataURL({
      format: "png",
      quality: 0.8,
      multiplier: 4,
    });
    const link = document.createElement("a");
    link.download = `fabric-board-${new Date().getTime()}.png`;
    link.href = pngData;
    link.click();
  };

  const clearBoard = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = canvasBg.current;
  };

  const exportBoard = () => {
    if (!fabricCanvas) return;
    const json = JSON.stringify(fabricCanvas.toDatalessJSON());
    const link = document.createElement("a");
    link.download = `fabric-board-${new Date().getTime()}.json`;
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`;
    link.click();
  };

  const loadBoard = () => {
    if (!fabricCanvas) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      if (!e.target) return;
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;
        const contents = event.target.result;
        fabricCanvas.loadFromJSON(contents, () => {
          fabricCanvas.renderAll();
        });
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const drawCircle = () => {
    if (!fabricCanvas) return;
    const circle = new fabric.Circle({
      radius: 50,
      stroke: penColor,
      strokeWidth: 1,
      fill: "transparent",
      left: 100,
      top: 100,
    });
    fabricCanvas.add(circle);
  };

  const drawArrow = () => {
    if (!fabricCanvas) return;
    // Create a line
    const line = new fabric.Line([50, 50, 200, 50], {
      strokeWidth: 2,
      stroke: penColor,
    });

    // Create an arrow head
    const arrowHead = new fabric.Triangle({
      width: 10,
      height: 10,
      fill: penColor,
      angle: -27,
      top: 47,
      left: 190,
    });

    // Group the line and arrow head together
    const group = new fabric.Group([line, arrowHead]);

    // Add the group to the canvas
    fabricCanvas.add(group);
  };

  const drawRect = () => {
    if (!fabricCanvas) return;
    const rect = new fabric.Rect({
      width: 90,
      height: 80,
      stroke: penColor,
      strokeWidth: 1,
      fill: "transparent",
      left: 50,
      top: 50,
    });
    fabricCanvas.add(rect);
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.IText("Hello World", {
      fill: penColor,
      left: 50,
      top: 50,
    });
    fabricCanvas.add(text);
  };

  const toggleDrawingMode = () => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = !fabricCanvas.isDrawingMode;
    setIsDrawing(fabricCanvas.isDrawingMode);
  };

  return (
    <div className="flex flex-col container mx-auto justify-center items-center gap-3 mt-3 h-full">
      <div className="flex max-w-[1280px] items-center relative justify-center w-full">
        <p className="text-3xl">Whiteboard</p>
        <div className="absolute mt-8 space-x-4 right-0">
          <button className="inline-block py-2 rounded" onClick={exportBoard}>
            <img src={exportIcon} alt="export" className="w-5 h-5" />
            Export
          </button>
          <button className="inline-block py-2 rounded" onClick={loadBoard}>
            <img src={importIcon} alt="load" className="w-5 h-5" />
            Import
          </button>
          <button className="inline-block py-2 rounded" onClick={downloadBoard}>
            <img src={downloadIcon} alt="download" className="w-5 h-5" />
            Save
          </button>
        </div>
      </div>
      <div>
        <button
          className="inline-block py-2 px-4 hover:scale-125 duration-75 rounded"
          onClick={handleUndo}
          disabled={canvasHistoryIndex < 0}
        >
          <img src={undoIcon} alt="undo" className="w-5 h-5" />
        </button>
        <button
          className="inline-block py-2 px-4 hover:scale-125 duration-75 rounded"
          onClick={handleRedo}
          disabled={canvasHistoryIndex === canvasHistory.current.length - 1}
        >
          <img src={redoIcon} alt="redo" className="w-5 h-5" />
        </button>
        <button
          className="inline-block py-2 px-4 hover:scale-125 duration-75 rounded"
          onClick={clearBoard}
        >
          <img src={trashIcon} alt="clear" className="w-5 h-5" />
        </button>
        <button
          className="inline-block py-2 px-4 hover:scale-125 duration-75 rounded"
          onClick={deleteSelected}
        >
          <img src={eraserIcon} alt="erase" className="w-5 h-5" />
        </button>
        <button
          className="inline-block py-2 px-4 hover:scale-125 duration-75 rounded"
          onClick={toggleDrawingMode}
        >
          <img
            src={isDrawing ? penIcon : selectIcon}
            alt="pen"
            className="w-5 h-5"
          />
        </button>
      </div>
      <canvas ref={canvasRef}></canvas>
      {/* Circle, Rectabnel, Text, Arrow*/}
      {/* Horizontal */}
      <div className="rounded-full absolute bottom-10 hidden lg:block w-1/2 bg-gray-100 shadow-md">
        <div className="flex justify-center gap-9 items-center h-12">
          <img
            src={circleIcon}
            alt="circle"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={drawCircle}
          />
          <img
            src={rectangleIcon}
            alt="rectangle"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={drawRect}
          />
          <img
            src={textIcon}
            alt="text"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={addText}
          />
          <img
            src={arrowIcon}
            alt="arrow"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={drawArrow}
          />
          <input
            type="color"
            value={penColor}
            className="cursor-pointer hover:scale-125 duration-100 "
            onChange={(e) => changePenColor(e.target.value)}
          />
          <div className="relative">
            <img
              src={widthIcon}
              alt="width"
              onClick={() => setWidthOpen(!widthOpen)}
              className="w-9 h-9 cursor-pointer scale-75 hover:scale-105 duration-100 "
            />
            {widthOpen && (
              <input
                type="range"
                min={1}
                max={30}
                className="absolute bottom-12 -left-9 cursor-ew-resize"
                value={penWidth}
                onChange={(e) => changePenWidth(parseInt(e.target.value))}
              />
            )}
          </div>
        </div>
      </div>
      {/* Vertical */}
      <div className="absolute border lg:hidden right-4 rounded-full h-fit py-5 bg-gray-100 shadow-md">
        <div className="flex flex-col px-1 h-full justify-center gap-9 items-center">
          <img
            src={circleIcon}
            alt="circle"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={drawCircle}
          />
          <img
            src={rectangleIcon}
            alt="rectangle"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={drawRect}
          />
          <img
            src={textIcon}
            alt="text"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={addText}
          />
          <img
            src={arrowIcon}
            alt="arrow"
            className="cursor-pointer hover:scale-125 duration-100 rounded w-9 h-9"
            onClick={drawArrow}
          />
          <input
            type="color"
            value={penColor}
            className="cursor-pointer hover:scale-125 duration-100 "
            onChange={(e) => changePenColor(e.target.value)}
          />
          <div className="relative">
            <img
              src={widthIcon}
              alt="width"
              onClick={() => setWidthOpen(!widthOpen)}
              className="w-9 h-9 cursor-pointer scale-75 hover:scale-105 duration-100 "
            />
            {widthOpen && (
              <input
                type="range"
                min={1}
                max={30}
                className="absolute top-16 -left-16 cursor-ew-resize"
                value={penWidth}
                onChange={(e) => changePenWidth(parseInt(e.target.value))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
