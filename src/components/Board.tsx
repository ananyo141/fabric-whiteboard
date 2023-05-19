import React from "react";
import { fabric } from "fabric";

const Board = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasBg = React.useRef<string>("#F9F0F0");
  const [penWidth, setPenWidth] = React.useState(3);
  const [penColor, setPenColor] = React.useState("#000000");
  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas>();
  const [eraserMode, setEraserMode] = React.useState(false);

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
            {eraserMode ? "Erasing Mode" : "Drawing Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
