import { fabric } from "fabric";

export const useBoardHandlers = ({
  fabricCanvas,
  canvasBg,
  canvasHistory,
  canvasHistoryIndex,
  setCanvasHistoryIndex,
  setPenWidth,
  penColor,
  setPenColor,
  setIsDrawing,
}) => {
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
      const file = (e.target as any).files?.[0];
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
    const text = new fabric.IText("Enter text", {
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
  return {
    saveCanvasState,
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
    changePenWidth,
    changePenColor,
  };
};
