import React from 'react';

function DicomInfo({ patientName, birthdate, age, sex }) {
  return (
    <div>
      <p>Patient Name: {patientName}</p>
      <p>Birthdate: {birthdate}</p>
      <p>Age: {age}</p>
      <p>Sex: {sex}</p>
    </div>
  );
}

export default DicomInfo;
