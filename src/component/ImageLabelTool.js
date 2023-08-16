import React, { useState, useRef, useEffect } from 'react';
import dicomParser from 'dicom-parser';

function ImageLabelTool({ image }) {
  const [labels, setLabels] = useState([]);
  const [labelCounter, setLabelCounter] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const canvasRef = useRef(null);
  const [dicomImageData, setDicomImageData] = useState(null);
  const [movingLabelIndex, setMovingLabelIndex] = useState(null);

  const loadDicomImage = () => {
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
        imageData.data[i * 4] = pixel >> 8; 
        imageData.data[i * 4 + 1] = pixel & 0xFF; 
        imageData.data[i * 4 + 2] = pixel & 0xFF; 
        imageData.data[i * 4 + 3] = 255;
      }

      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.putImageData(imageData, 0, 0);
      setDicomImageData(imageData);
      drawLabels(); // 確保在 DICOM 圖像加載後繪製標籤
    };

    fileReader.readAsArrayBuffer(image);
  };

  useEffect(() => {
    loadDicomImage();
  }, [image]);
  
  const handleAddLabel = () => {
    const newLabel = {
      name: `Label${labelCounter}`,
      x: 50, 
      y: 50 + labelCounter * 30,
      width: 100,
      height: 30
    };
    setLabels([...labels, newLabel]);
    setLabelCounter(labelCounter + 1);
  };

  const handleEditLabel = (index) => {
    setMovingLabelIndex(index);
  };

  const handleDeleteLabel = (index) => {
    const newLabels = labels.filter((_, i) => i !== index);
    setLabels(newLabels);
  };

  const handleMouseDown = (e) => {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    // 檢查是否點擊了某一個 label
    const clickedLabelIndex = labels.findIndex(label => 
        mouseX >= label.x && mouseX <= label.x + label.width &&
        mouseY >= label.y && mouseY <= label.y + label.height
    );

    if (clickedLabelIndex !== -1) {
        setMovingLabelIndex(clickedLabelIndex);
    } else {
        // 其他原有的代碼
        setDrawing(true);
        setStartPoint({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseMove = (e) => {
    if (movingLabelIndex !== null) {
        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;

        // 更新 label 的位置
        const updatedLabels = [...labels];
        updatedLabels[movingLabelIndex].x = mouseX;
        updatedLabels[movingLabelIndex].y = mouseY;
        setLabels(updatedLabels);
    }
};

  const handleMouseUp = (e) => {
    setMovingLabelIndex(null);
    setDrawing(false);
    setStartPoint(null);
  };

  const drawLabels = () => {
    if (!canvasRef.current) return; 
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // 先繪製DICOM圖像
    if (dicomImageData) {
        ctx.putImageData(dicomImageData, 0, 0);
    }
  
    // 在圖像上渲染標籤
    ctx.fillStyle = "white"; 
    ctx.strokeStyle = "white"; 
    labels.forEach(label => {
      ctx.strokeRect(label.x, label.y, label.width, label.height);
    });
  };
  
  useEffect(() => {
    drawLabels();
  }, [labels, dicomImageData]); 

  return (
    <div className='d-flex'>
      <div className='col-6'>
        <canvas 
          ref={canvasRef} 
          onMouseDown={handleMouseDown} 
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
      <div className='col-6'>
        <h3>Label Tools</h3>
        <button onClick={handleAddLabel} className="btn btn-primary my-4">Add</button>
        <div>
            <h4 className='mb-3'>Label List</h4>
            {labels.map((label, index) => (
            <ul key={index} className="d-flex align-items-center mb-2">
              <li>
                <span className="mr-2 me-2">{label.name}</span>
                <button onClick={() => handleEditLabel(index)} className="btn border btn-sm mr-2">Edit</button>
                <button onClick={() => handleDeleteLabel(index)} className="btn border btn-sm ms-2">Delete</button>
              </li>
            </ul>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ImageLabelTool;
