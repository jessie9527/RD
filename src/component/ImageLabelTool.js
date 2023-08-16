import React, { useState } from 'react';

function ImageLabelTool({ image }) {
  const [labels, setLabels] = useState([]);
  const [labelCounter, setLabelCounter] = useState(1);

  const handleAddLabel = () => {
    // 創建新標籤並使用計數器
    const newLabel = { name: `Label${labelCounter}` };
    setLabels([...labels, newLabel]);

    // 更新計數器
    setLabelCounter(labelCounter + 1);
  };

  const handleEditLabel = (index) => {
    // 這裡可以添加編輯標籤的邏輯
  };

  const handleDeleteLabel = (index) => {
    // 這裡可以添加刪除標籤的邏輯
    setLabels(labels.filter((_, i) => i !== index));
  };

  return (
    <div className='mt-5 ms-5'>
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
  );
}

export default ImageLabelTool;
