import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../../Styles/AdminDashboard/appointmentsBooked.css'; // Import your CSS file

const AppointmentsBooked = () => {
  const [selectedOption, setSelectedOption] = useState('month');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedOption]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/v1/appointment/appointmentsCount?range=${selectedOption.toLowerCase()}`);
      
      const responseData = await response.json();
      console.log(responseData);
      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null); // Reset data to null to indicate error
    } finally {
      setLoading(false);
    }
  };



  const formatXAxis = () => {
    if (selectedOption === 'week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 1 - i);
        return days[date.getDay()];
      }).reverse();
    } else if (selectedOption === 'month') {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    } else {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
  };

  // const formatYAxis = () => {
  //   if (data) {
  //     const values = data.map(item => item.value);
  //     return [Math.min(...values), Math.max(...values)];
  //   }
  //   return [0, 0];
  // };

  // Data for the current month
  // const dataThisMonth = {
  //   labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
  //   datasets: [
  //     {
  //       label: 'Appointments Booked',
  //       data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310],
  //       borderColor: 'rgb(255, 0, 0)',
  //       tension: 0
  //     }
  //   ]
  // };

  // // Data for the current year
  // const dataThisYear = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  //   datasets: [
  //     {
  //       label: 'Appointments Booked',
  //       data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  //       borderColor: 'rgb(255, 0, 0)',
  //       tension: 0
  //     }
  //   ]
  // };

  // const handleSelectChange = (e) => {
  //   setSelectedOption(e.target.value);
  // };

  console.log('Data:', data);

  return (
    <div className="graph-container">
      <div className="select-container">
        <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="graph">
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <Line
            data={{
              labels: formatXAxis(),
              datasets: [
                {
                  label: 'Appointments Booked',
                  data: data,
                  borderColor: 'rgb(255, 0, 0)',
                  tension: 0
                }
              ]
            }}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};


export default AppointmentsBooked;
