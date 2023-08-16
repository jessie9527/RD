import React, { useState, useRef, useEffect } from 'react';
import dicomParser from 'dicom-parser';

function ImageLabelTool({ image }) {
  const [labels, setLabels] = useState([]);
  const [labelCounter, setLabelCounter] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const canvasRef = useRef(null);
  const [dicomImageData, setDicomImageData] = useState(null);

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
    // 創建新標籤並使用計數器
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
    // 這裡可以添加編輯標籤的邏輯
    const editedLabels = [...labels];
    editedLabels[index].x += 10;
    setLabels(editedLabels);
  };

  const handleDeleteLabel = (index) => {
    const newLabels = labels.filter((_, i) => i !== index);
    setLabels(newLabels);
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    setStartPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseUp = (e) => {
    if (drawing && startPoint) {
      const endPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      const newLabel = {
        name: `Label${labelCounter}`,
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
        width: Math.abs(startPoint.x - endPoint.x),
        height: Math.abs(startPoint.y - endPoint.y),
      };
      setLabels([...labels, newLabel]);
      setLabelCounter(labelCounter + 1);
    }
    setDrawing(false);
    setStartPoint(null);
  };

  const drawLabels = () => {
    if (!canvasRef.current) return; // 檢查 canvas 是否存在
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 清空畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // 先繪製DICOM圖像
    if (dicomImageData) {
        ctx.putImageData(dicomImageData, 0, 0);
    }
  
    // 然後在圖像上渲染標籤
    ctx.fillStyle = "white";  // 設定文字顏色為白色
    ctx.strokeStyle = "white"; 
    labels.forEach(label => {
      ctx.strokeRect(label.x, label.y, label.width, label.height);
    });
  };
  
  useEffect(() => {
    drawLabels();
  }, [labels, dicomImageData]); // 添加 dicomImageData 到依賴  

  return (
    <div className='d-flex'>
      <div className='col-6'>
        <canvas 
          ref={canvasRef} 
          onMouseDown={handleMouseDown} 
          onMouseUp={handleMouseUp}
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
