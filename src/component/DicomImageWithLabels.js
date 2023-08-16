import React, { useRef, useEffect, useState } from "react";
import dicomParser from "dicom-parser";

function DicomImageWithLabels({ image }) {
  const canvasRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [labelCounter, setLabelCounter] = useState(1);
  const [painting, setPainting] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const dicomData = dicomParser.parseDicom(
        new Uint8Array(event.target.result)
      );

      const width = dicomData.uint16("x00280010");
      const height = dicomData.uint16("x00280011");
      const pixelDataElement = dicomData.elements.x7fe00010;
      const pixelData = new Uint16Array(
        dicomData.byteArray.buffer,
        pixelDataElement.dataOffset,
        pixelDataElement.length / 2
      );

      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < pixelData.length; i++) {
        const pixel = pixelData[i];
        imageData.data[i * 4] = pixel >> 8; // R
        imageData.data[i * 4 + 1] = pixel & 0xff; // G
        imageData.data[i * 4 + 2] = pixel & 0xff; // B
        imageData.data[i * 4 + 3] = 255; // A
      }

      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.putImageData(imageData, 0, 0);
    };

    fileReader.readAsArrayBuffer(image);
  }, [image]);

  const getPaintPosition = (e) => {
    const canvasSize = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - canvasSize.left,
      y: e.clientY - canvasSize.top,
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setPainting(true);
    setCurrentPath([getPaintPosition(e)]);
  };

  const handleMouseUp = () => {
    setPainting(false);
    setPaths([...paths, currentPath]);
    setCurrentPath([]);
  };

  const handleMouseMove = (e) => {
    if (!painting) return;
    const position = getPaintPosition(e);
    setCurrentPath((prevPath) => [...prevPath, position]);
  };

  const handleAddLabel = () => {
    const newLabel = { name: `Label${labelCounter}` };
    setLabels([...labels, newLabel]);
    setLabelCounter(labelCounter + 1);
  };

  // ... 其他 handleEditLabel 和 handleDeleteLabel 函數

  return (
    <div className="mt-5 ms-5">
      <h3>Label Tools</h3>
      <button onClick={handleAddLabel} className="btn btn-primary my-4">
        Add
      </button>
      {/* 在這裡添加 ImageLabelTool 的 JSX */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export default DicomImageWithLabels;
