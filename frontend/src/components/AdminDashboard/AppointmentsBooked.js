import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../../Styles/AdminDashboard/appointmentsBooked.css'; // Import your CSS file

const AppointmentsBooked = () => {
  const [selectedOption, setSelectedOption] = useState('This Month');

  // Data for the current month
  const dataThisMonth = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    datasets: [
      {
        label: 'Appointments Booked',
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0
      }
    ]
  };

  // Data for the current year
  const dataThisYear = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Appointments Booked',
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        borderColor: 'rgb(255, 0, 0)',
        tension: 0
      }
    ]
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="graph-container">
      <div className="select-container">
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>
      <div className="graph">
        <Line data={selectedOption === 'This Month' ? dataThisMonth : dataThisYear} />
      </div>
    </div>
  );
};

export default AppointmentsBooked;
