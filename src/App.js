// import logo from './logo.svg';
import React from "react";
import "./App.css";
import DicomUploader from "./component/DicomUploader";
import ImageLabelTool from "./component/ImageLabelTool"; // 確保這個路徑是正確的

function App() {
  return (
    <div className="App">
      <header className="App-header d-flex ">
        <DicomUploader />
        <ImageLabelTool />
      </header>
    </div>
  );
}

export default App;
