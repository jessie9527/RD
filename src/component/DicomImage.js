import React, { useRef, useState, useEffect } from "react";
import dicomParser from "dicom-parser";

function DicomImage({ image }) {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = 4;
    context.lineCap = "round";
    setCtx(context);

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

      const imageData = context.createImageData(width, height);

      for (let i = 0; i < pixelData.length; i++) {
        const pixel = pixelData[i];
        imageData.data[i * 4] = pixel >> 8; // R
        imageData.data[i * 4 + 1] = pixel & 0xff; // G
        imageData.data[i * 4 + 2] = pixel & 0xff; // B
        imageData.data[i * 4 + 3] = 255; // A
      }

      context.canvas.width = width;
      context.canvas.height = height;
      context.putImageData(imageData, 0, 0);
    };

    fileReader.readAsArrayBuffer(image);
  }, [image]);

  const startPaint = () => {
    setIsPainting(true);
  };

  const endPaint = () => {
    setIsPainting(false);
    ctx && ctx.beginPath();
  };

  const draw = (event) => {
    if (!isPainting) return;

    const { offsetX, offsetY } = event.nativeEvent;
    ctx && ctx.lineTo(offsetX, offsetY);
    ctx && ctx.stroke();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800} // Set the width of the canvas
        height={600} // Set the height of the canvas
        onMouseDown={startPaint}
        onMouseUp={endPaint}
        onMouseMove={draw}
        onTouchStart={startPaint}
        onTouchEnd={endPaint}
        onTouchMove={draw}
      />
    </div>
  );
}

export default DicomImage;
