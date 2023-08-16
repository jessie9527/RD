// import logo from './logo.svg';
import React from 'react';
import './App.css';
import DicomUploader from './component/DicomUploader'
// import ImageLabelTool from './component/ImageLabelTool'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DicomUploader/>
        {/* <ImageLabelTool/> */}
      </header>
    </div>
  );
}

export default App;
