import React, { useState, useRef } from 'react';
import DicomInfo from './DicomInfo';
import ImageLabelTool from './ImageLabelTool'; 


function DicomUploader() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // 假設您從檔案中提取資訊
    // 這裡你可以添加解析DICOM檔案並提取病患資訊的邏輯
    setPatientName('John Doe');
    setBirthdate('1990-01-01');
    setAge('32');
    setSex('Male');
  };

  return (
    <div className="mt-5 ms-5 d-flex ">
      <div className="col-2">
        <input
          type="file"
          accept=".dcm"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button onClick={handleUploadButtonClick} className="btn btn-primary mb-4">Upload</button>
        <DicomInfo
          patientName={patientName}
          birthdate={birthdate}
          age={age}
          sex={sex}
        />
      </div>
      <div className='col-10'>
        {selectedFile && <ImageLabelTool image={selectedFile} />}
      </div>
    </div>
  );
}

export default DicomUploader;
