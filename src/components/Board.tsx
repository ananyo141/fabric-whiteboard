import React from "react";
import { fabric } from "fabric";

type Props = {};

const Board = (props: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [penWidth, setPenWidth] = React.useState(3);
  const [penColor, setPenColor] = React.useState("#000");
  const [fabricCanvas, setFabricCanvas] = React.useState<fabric.Canvas>();

  React.useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
      width: 1280,
      height: 500,
      backgroundColor: "#999",
      isDrawingMode: true,
    });
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasRef]);

  const changePenWidth = (width: number) => {
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.width = width;
      setPenWidth(width);
      fabricCanvas.renderAll.bind(fabricCanvas);
    }
  };

  const changePenColor = (color: string) => {
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.color = color;
      setPenColor(color);
      fabricCanvas.renderAll.bind(fabricCanvas);
    }
  };

  return (
    <div className="container w-full h-full">
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
      </div>
    </div>
  );
};

export default Board;
