// import React from 'react'

// function Report() {
//   return (
//     <div>Report</div>
//   )
// }

// export default Report

import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { utils, writeFile } from 'xlsx';

function Report() {
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/getLeave')
      .then((result) => {
        setEmpData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    const worksheet = utils.json_to_sheet(empData.map(i => ({
      "Employee ID": i.emp_id,
      "Days Present": i.present_days.length,
      "Days Absent": i.lop.length,
      "Leaves Taken": i.paid_leave.length,
      "Total Working Days": i.total_working_days.length,
      "Performance %": ((i.present_days.length / i.total_working_days.length) * 100).toFixed(2) + ' %'
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Employee Data');
    writeFile(workbook, 'employee_data.xlsx');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Report">
      <i className="fa-regular fa-circle-down" onClick={handleDownload}></i>
      <div className="content-lable">
            <p><b>Employee<span className='small light'></span></b></p>
            <p>Employee <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Report</span></p>
        </div>
      <div>
        <header>
          {/* <h1>Employee Data And Division</h1> */}
        </header>
        <section className='report-table_body'>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Days Present</th>
                <th>Days Absent</th>
                <th>Leaves Taken</th>
                <th>Total Working Days</th>
                <th>Performance %</th>
              </tr>
            </thead>
            <tbody>
              {empData.map(i => (
                <tr key={i.emp_id}>
                  <td>{i.emp_id}</td>
                  <td>{i.present_days.length}</td>
                  <td>{i.lop.length}</td>
                  <td>{i.paid_leave.length}</td>
                  <td>{i.total_working_days.length}</td>
                  <td>{((i.present_days.length / i.total_working_days.length) * 100).toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default Report;