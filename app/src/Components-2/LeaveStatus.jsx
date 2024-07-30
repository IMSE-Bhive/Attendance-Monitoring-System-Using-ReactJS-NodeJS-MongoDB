import axios from 'axios'
import React, { useEffect, useState } from 'react'

function LeaveStatus({empLeave}) {
    // const [empLeave, setEmpLeave] = useState([])

    // useEffect(()=>{
    //     axios.post('http://localhost:8081/getLeaveStatus', { emp_id })
    //     .then((result) => {
    //         console.log(result.data)
    //         setEmpLeave(result.data)
    //     })
    //     .catch(err => console.log(err))
    // },[emp_id])
  return (
    <>
    <div className='holidays-container leave-Status'>
                    <div className="content-lable">
                    <p><b>Leave Status Tracking</b></p>
                    <p>Dashboard <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Leave Status</span></p>
                </div>
                    <section>
                        <table>
                            <thead>
                                <tr>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Leave Type</th>
                                    <th>Day Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empLeave.map((item, i) => (
                                    <tr>
                                        <td>{item.fromDate}</td>
                                        <td>{item.toDate}</td>
                                        <td>{item.leaveType}</td>
                                        <td>{item.dayType}</td>
                                        {item.status === 'Approved' ? <td style={{ backgroundColor: 'lightgreen' }}>{item.status}</td> : <td style={{ backgroundColor: '#d87073' }}>{item.status}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
    </>
  )
}

export default LeaveStatus