import axios from 'axios'
import React, { useState } from 'react'

function ApplyLeave({state,empLeave , handleClick, cDate}) {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [dayType, setDayType] = useState('')
    const [leaveType, setLeaveType] = useState('')
    const [reason, setReason] = useState('')
    const [leaveStatus, setLeaveStatus] = useState([])
    const submitFun=(e)=>{
        e.preventDefault()
        // alert("submit")
        // console.log(fromDate);
        // console.log(toDate);
        // console.log(dayType);
        // console.log(leaveType);
        // console.log(reason);
        // console.log(state);
        console.log(cDate);
       
        if(fromDate!=='' || toDate!=='' || dayType!=='' || leaveType!=='' || reason!==''){
            axios.post('http://localhost:8081/applyLeave', { emp_id:state.emp_id, fromDate, toDate, dayType, leaveType, reason, status: 'Pending',date:cDate })
            .then((result) => {
                console.log(result.data)
                alert("Apply Successfully")
                setFromDate('')
                setToDate('')
                setDayType('')
                setLeaveType('')
                setReason('')
            })
            .catch(err => console.log(err))
        }
        else{
            alert('Please fill all necessary details')
        }
    }
    const cancelFun=(e)=>{
        e.preventDefault()
        alert("Leave Request is canceled")
        setFromDate('')
        setToDate('')
        setDayType('')
        setLeaveType('')
        setReason('')
    }
  return (
    <>
        <div className="applyLeave">
            <div className="heading">
            <button onClick={e=>handleClick(0)}>Back</button>
               <h3> Apply leave</h3>
               
            </div>
            <div className="applyLeave-section">
                    <p className='leave-remaining'>You have <span>{2 - (empLeave?.this_month_paidLeave?.length ?? 0)} leaves</span> and <span>{empLeave?.earnedLeave ?? 0}optional</span> leave in this month.</p>
                    <form action="" >
                        <div className="type">
                            <div className="leaveType">
                                <p><b>Leave Type</b></p>
                                <div className="checkBox">
                                    <div>
                                        <input type="radio" value="Sick Leave" name='leaveType' checked={leaveType==='Sick Leave'} onClick={e=>setLeaveType(e.target.value)}/> 
                                        <p>Sick Leave</p>
                                    </div>
                                    <div>
                                        <input type="radio" value="Earned Leave" name='leaveType' checked={leaveType==='Earned Leave'} onClick={e=>setLeaveType(e.target.value)}/>
                                        <p>Earned Leave</p>
                                    </div>
                                    <div>
                                        <input type="radio" value="Unpaid Leave" name='leaveType' checked={leaveType==='Unpaid Leave'} onClick={e=>setLeaveType(e.target.value)}/>
                                        <p>Unpaid Leave</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dayType">
                                <p><b>Day Type</b></p>
                                <div className="checkBox">
                                    <div>
                                        <input type="radio" value="Full Day" name='dayType' checked={dayType==='Full Day'} onClick={e=>setDayType(e.target.value)}/> 
                                        <p>Full Day</p>
                                    </div>
                                    <div>
                                        <input type="radio" value="First Half" name='dayType' checked={dayType==='First Half'}  onClick={e=>setDayType(e.target.value)}/>
                                        <p>1st Half </p>
                                    </div>
                                    <div>
                                        <input type="radio" value="Second Half" name='dayType' checked={dayType==='Second Half'} onClick={e=>setDayType(e.target.value)}/>
                                        <p>2nd Half</p>
                                    </div>
                                </div>
                            </div>

                            <div className="startDate">
                                <p><b>From</b></p>
                                <input type="date"  value={fromDate} onChange={e => setFromDate(e.target.value)} />
                            </div>
                            <div className="endDate">
                                <p><b>To</b></p>
                                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}/>
                            </div>
                            
                        </div>
                        {/* <div className="leaveDate">
                                
                        </div> */}
                        <div className='reason'>
                            <label><b>Reason:</b> </label><br />
                            <textarea name="" value={reason} onChange={e => setReason(e.target.value)}></textarea>
                        </div>
                        <button onClick={cancelFun}>Cancel</button>
                        <input type="submit" onClick={submitFun}/>
                    </form>
            </div>
        </div>
    </>
  )
}

export default ApplyLeave