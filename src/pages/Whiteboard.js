import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import useImage from "use-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faExpand, faUndo, faRedo, faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";

const Whiteboard = () => {
  const [tool, setTool] = useState("pencil");
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [thickness, setThickness] = useState(3);
  const [background, setBackground] = useState("white");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const stageRef = useRef(null);
  

  // Load background image only when it changes
  const [bgImage] = useImage(backgroundImage || "", "Anonymous");

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    if (tool === "pencil" || tool === "eraser") {
      setLines([...lines, { points: [pos.x, pos.y], color: tool === "eraser" ? "white" : color, thickness }]);
      setUndoStack([...undoStack, lines]);
      setRedoStack([]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === "pencil" || tool === "eraser") {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines(lines.slice(0, -1).concat(lastLine));
    }
  };

  const handleMouseUp = () => setIsDrawing(false);

  const undo = () => {
    if (undoStack.length > 0) {
      setRedoStack([...redoStack, lines]);
      setLines(undoStack[undoStack.length - 1]);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      setUndoStack([...undoStack, lines]);
      setLines(redoStack[redoStack.length - 1]);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const clearBoard = () => {
    setUndoStack([...undoStack, lines]);
    setLines([]);
  };

 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBackgroundImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearBackground = () => {
    setBackground("white");
    setBackgroundImage(null);

    // Reset file input value
    if (document.getElementById("bgImageInput")) {
      document.getElementById("bgImageInput").value = "";
    }
  };

  const saveAsImage = () => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL({ pixelRatio: 2 }); // High resolution
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {isMinimized ? (
        <div style={{ position: "fixed", bottom: "10px", right: "10px", background: "#333", padding: "10px", borderRadius: "5px", color: "white", cursor: "pointer" }} onClick={() => setIsMinimized(false)}>
          <FontAwesomeIcon icon={faExpand} /> Restore Virtual Board
        </div>
      ) : (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0, 0, 0, 0.1)", zIndex: 1000 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "white", alignItems: "center" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>Virtual Board</span>
            <FontAwesomeIcon icon={faWindowMinimize} style={{ cursor: "pointer", marginRight: "20px" }} onClick={() => setIsMinimized(true)} />
          </div>

          <div style={{ padding: "10px", background: "#f0f0f0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setTool("pencil")}>Pencil</button>
            <button onClick={() => setTool("eraser")}>
              <FontAwesomeIcon icon={faEraser} /> Eraser
            </button>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="range" min="1" max="10" value={thickness} onChange={(e) => setThickness(e.target.value)} />
            <button onClick={undo}>
              <FontAwesomeIcon icon={faUndo} /> Undo
            </button>
            <button onClick={redo}>
              <FontAwesomeIcon icon={faRedo} /> Redo
            </button>
            <button onClick={clearBoard}>
              <FontAwesomeIcon icon={faTrash} /> Clear Board
            </button>


            <input id="bgImageInput" type="file" accept="image/*" onChange={handleImageUpload} />

            <button onClick={clearBackground}>Clear Background</button>
            <button onClick={saveAsImage}>Save as Image</button>
          </div>

          <Stage ref={stageRef} width={window.innerWidth} height={window.innerHeight - 50} style={{ background }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <Layer>
              {bgImage && <Image image={bgImage} x={0} y={0} width={window.innerWidth} height={window.innerHeight} />}
              {lines.map((line, i) => (
                <Line key={i} points={line.points} stroke={line.color} strokeWidth={line.thickness} lineCap="round" lineJoin="round" />
              ))}
            </Layer>
          </Stage>
        </div>
      )}
    </>
  );
};

export default Whiteboard;
