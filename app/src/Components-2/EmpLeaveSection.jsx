import React, { useEffect, useState } from 'react'
import LeaveProgressBar from './LeaveProgressBar'
import circle2 from '../Assets/circle2.png'
import rightLogo from '../Assets/rightLogo.png'
import requestLogo from '../Assets/requestLogo.png'
import xLogo from '../Assets/x.png'
import pendingLogo from '../Assets/pending.png'
import axios from 'axios'
function EmpLeaveSection({ leaveCollection, leaveStatus}) {

  // const [leaveStatus, setLeaveStatus] = useState([])
  const [approved, setApproved] = useState(0)
  // useEffect(() => {
  //   axios.post('http://localhost:8081/getLeaveStatus', { emp_id: leaveCollection.emp_id })
  //     .then((result) => {
  //       console.log(result.data)
  //       setLeaveStatus(result.data)
  //       if (result.data) {

  //       }
  //     })
  //     .catch(err => console.log(err))
  // }, [leaveCollection])

  return (
    <>
      <div className="leaveSection">
        {/* <div className="leaveSection-heading">
                <p><b>Leave Request</b></p>
               
            </div> */}
        <div className="leaveSection-details">
          <div className="leave-balance">
            <p style={{ color: 'orange' }}> <b>Leave Balance {new Date().getFullYear()}</b></p>
            <div className="progress" style={{ width: '50%' }}>
              <LeaveProgressBar leaveData={leaveCollection} type='balance' />
            </div>
            <div className='this-month'>
              <p>Leave balance in this month</p>
              <h3>{leaveCollection?.this_month_paidLeave?.length}/{2 + leaveCollection.earnedLeave}</h3>


            </div>


          </div>

          <div className="leave-request">
            <div className="leave-request-block">
              <div className="leave-request-img">
                <img src={requestLogo} alt="" />
              </div>
              <div className="leave-request-block-content" style={{ width: '100%' }}>
                <p className='leave-request-heading'><b>Leave Request</b></p>
                <h1>{leaveStatus ? leaveStatus.length : 0}</h1>
              </div>
            </div>

            <div className="leave-request-block">
              <div className="leave-request-img">
                <img src={rightLogo} alt="" />
              </div>
              <div className="leave-request-block-content" style={{ width: '100%' }}>
                <p className='leave-request-heading'><b>Leave Approved</b></p>
                <h1>{leaveStatus ? leaveStatus.filter(item => item.status === 'Approved').length : 0}</h1>
              </div>
            </div>

            <div className="leave-request-block">
              <div className="leave-request-img">
                <img src={xLogo} alt="" />
              </div>
              <div className="leave-request-block-content" style={{ width: '100%' }}>
                <p className='leave-request-heading'><b>Leave Reject</b></p>
                <h1>{leaveStatus ? leaveStatus.filter(item => item.status === 'Rejected').length : 0}</h1>
              </div>
            </div>

            <div className="leave-request-block">
              <div className="leave-request-img">
                <img src={pendingLogo} alt="" />
              </div>
              <div className="leave-request-block-content" style={{ width: '100%' }}>
                <p className='leave-request-heading'><b>Leave Pendding</b></p>
                <h1>{leaveStatus ? leaveStatus.filter(item => item.status === 'Pending').length : 0}</h1>
              </div>
            </div>
          </div>
        </div>
        <h2 style={{ padding: '10px', color: 'rgba(0,0,0,0.7)' }}>History</h2>
        <div className='leave-history'>
          <table>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Day Type</th>
                <th>Total Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveStatus && leaveStatus.reverse().map((item, i) => {
                const fromDate = new Date(item.fromDate);
                const toDate = new Date(item.toDate);
                const diffInTime = toDate.getTime() - fromDate.getTime();
                const diffInDays = diffInTime / (1000 * 3600 * 24) +1;

                return (
                  <tr key={i}>
                    <td>{item.leaveType || '-'}</td>
                    <td>{item.fromDate.split('-').reverse().join('-') || '-'}</td>
                    <td>{item.toDate.split('-').reverse().join('-')}</td>
                    <td>{item.dayType || '-'}</td>
                    <td>{diffInDays || '-'} </td>
                    <td>{item.status}</td>
                  </tr>
                );
                
              })}

{leaveStatus && leaveStatus.reverse().map((item, i) => {
                const fromDate = new Date(item.fromDate);
                const toDate = new Date(item.toDate);
                const diffInTime = toDate.getTime() - fromDate.getTime();
                const diffInDays = diffInTime / (1000 * 3600 * 24) +1;

                return (
                  <tr key={i}>
                    <td>{item.leaveType || '-'}</td>
                    <td>{item.fromDate.split('-').reverse().join('-') || '-'}</td>
                    <td>{item.toDate.split('-').reverse().join('-')}</td>
                    <td>{item.dayType || '-'}</td>
                    <td>{diffInDays || '-'} </td>
                    <td>{item.status}</td>
                  </tr>
                );
                
              })}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default EmpLeaveSection