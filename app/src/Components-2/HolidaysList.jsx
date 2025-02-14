import React from 'react'

function HolidaysList() {
  return (
    <>
    <div className="holidays">
    <div className="content-lable">
                    <p style={{textAlign:'center', fontSize:'20px', color:'rgba(0, 0, 0, 0.819)'}}><b>Holidays List <span style={{color:'orange', fontSize:'25px'}}>{new Date().getFullYear()}</span></b></p>
                    {/* <p>Dashboard <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Holidays</span></p> */}
                </div>
      <div className="holidays-container">
        <table>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Holiday</th>
              <th>Date</th>
              <th>Day</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>New Year’s Day</td>
              <td>01 January 2024</td>
              <td>Monday</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Republic Day</td>
              <td>26 January 2024</td>
              <td>Friday</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Holi</td>
              <td>25 March 2024</td>
              <td>Monday</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Independence Day</td>
              <td>15 August 2024</td>
              <td>Thursday</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Gandhi Jayanti</td>
              <td>02 October 2024</td>
              <td>Wednesday</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Dussehra</td>
              <td>12 October 2024</td>
              <td>Saturday</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Diwali</td>
              <td>01 November 2024</td>
              <td>Friday</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Christmas Day</td>
              <td>25 December 2024</td>
              <td>Wednesday</td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </div>
    </>
  )
}

export default HolidaysList