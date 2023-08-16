import React, { useRef, useEffect } from 'react';
import dicomParser from 'dicom-parser';

function DicomImage({ image }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const dicomData = dicomParser.parseDicom(new Uint8Array(event.target.result));

      const width = dicomData.uint16('x00280010');
      const height = dicomData.uint16('x00280011');
      const pixelDataElement = dicomData.elements.x7fe00010;
      const pixelData = new Uint16Array(dicomData.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);

      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < pixelData.length; i++) {
        const pixel = pixelData[i];
        imageData.data[i * 4] = pixel >> 8; // R
        imageData.data[i * 4 + 1] = pixel & 0xFF; // G
        imageData.data[i * 4 + 2] = pixel & 0xFF; // B
        imageData.data[i * 4 + 3] = 255; // A
      }

      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.putImageData(imageData, 0, 0);
    };

    fileReader.readAsArrayBuffer(image);
  }, [image]);

  return <canvas ref={canvasRef} />;
}

export default DicomImage;
