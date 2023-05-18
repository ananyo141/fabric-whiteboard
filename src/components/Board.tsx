import React from "react";
import { fabric } from "fabric";

type Props = {};

const Board = (props: Props) => {
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

  return (
    <div className="flex flex-col items-center gap-3 mt-3 w-full h-full">
      <p className="text-3xl">Whiteboard</p>
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
