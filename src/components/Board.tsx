import React from "react";
import { fabric } from "fabric";

const Board = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasBg = React.useRef<string>("#F9F0F0");
  const [penWidth, setPenWidth] = React.useState(3);
  const [penColor, setPenColor] = React.useState("#000000");
  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas>();
  const [isDrawing, setIsDrawing] = React.useState(true);
  const [eraserMode, setEraserMode] = React.useState(false);

  const canvasHistory = React.useRef<any>([]);
  const [canvasHistoryIndex, setCanvasHistoryIndex] =
    React.useState<number>(-1);

  React.useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
      width: 1280,
      height: 500,
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
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
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

  const toggleEraser = () => {
    if (!fabricCanvas) return;
    changePenColor(eraserMode ? "#000000" : canvasBg.current);
    setEraserMode(!eraserMode);
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
    var line = new fabric.Line([50, 50, 200, 50], {
      strokeWidth: 2,
      stroke: penColor,
    });

    // Create an arrow head
    var arrowHead = new fabric.Triangle({
      width: 10,
      height: 10,
      fill: penColor,
      angle: -27,
      top: 47,
      left: 190,
    });

    // Group the line and arrow head together
    var group = new fabric.Group([line, arrowHead]);

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

  const addImage = () => {
    if (!fabricCanvas) return;
    const img = new Image();
    img.onload = () => {
      const image = new fabric.Image(img);
      fabricCanvas.add(image);
    };

    img.src = "https://picsum.photos/200/300";
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
        <div className="absolute space-x-3 right-0">
          <button
            type="button"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={exportBoard}
          >
            Export
          </button>
          <button
            type="button"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={loadBoard}
          >
            Load
          </button>
        </div>
      </div>
      <canvas ref={canvasRef}></canvas>
      <div>
        <div>
          <label>Pen Width - {penWidth}</label>
          <input
            type="range"
            min={1}
            max={30}
            value={penWidth}
            onChange={(e) => changePenWidth(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Pen Color - {penColor}</label>
          <input
            type="color"
            value={penColor}
            onChange={(e) => changePenColor(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={downloadBoard}
          >
            Download
          </button>

          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={clearBoard}
          >
            Clear
          </button>

          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleEraser}
          >
            {eraserMode ? "Disable Eraser" : "Enable Eraser"}
          </button>
        </div>
        <div className="space-x-3 mt-2">
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={drawCircle}
          >
            Draw Circle
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={drawRect}
          >
            Draw Rectangle
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={addText}
          >
            Add Text
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={addImage}
          >
            Add Image
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={drawArrow}
          >
            Arrow
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleDrawingMode}
          >
            {isDrawing ? "Drawing" : "Enable Drawing"}
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={deleteSelected}
          >
            Delete
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRedo}
          >
            Redo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
