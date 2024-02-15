import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SelectOptionPage = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <h1>Register as a:</h1>
      <button onClick={() => handleOptionSelect('Option 1')}>Option 1</button>
      <button onClick={() => handleOptionSelect('Option 2')}>Option 2</button>
      <Link to={`/register/${selectedOption}`}><button disabled={!selectedOption}>Register</button></Link>
    </div>
  );
};

export default SelectOptionPage;
