import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
// import leaveIcon from '../Assets/leave.png'

function LeaveDashboard({handleClick, state}) {
    const location = useLocation()
    // const { state } = location;
    // const emp_id = 'chintu@gmail.com'
    // console.log(emp_id)

    const [emp, setEmp] = useState({})
    const [empLeave, setEmpLeave] = useState({})
    const [btnVisibility, setBtnVisibility] = useState('byTime-Class hidden')
    const [currentDate, setCurrentDate] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [dayType, setDayType] = useState('')
    const [leaveType, setLeaveType] = useState('')
    const [remarks, setRemarks] = useState('')
    const [leaveStatus, setLeaveStatus] = useState([])
    const [leave_status_class, setLeave_status_class] = useState('leave-status hidden')


    useEffect(() => {
        axios.post('http://localhost:8081/getEmployee', { emp_id:state.emp_id})
            .then((result) => {
                console.log(result.data)
                setEmp(result.data)
            })
            .catch(err => console.log(err))

        axios.post('http://localhost:8081/getLeave', { emp_id:state.emp_id})
            .then((result) => {
                console.log(result.data)
                setEmpLeave(result.data)
            })
            .catch(err => console.log(err))
    }, [state])

    useEffect(() => {
        let date = new Date();
        // let month=(date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1)
        // let currentDate = date.getDate()+' - '+month+' - '+date.getFullYear()
        let month = (date.getMonth() + 1).toString().padStart(2, '0')
        let d = date.getDate().toString().padStart(2, '0')
        let currentdate = date.getFullYear() + '-' + month + '-' + d
        setCurrentDate(currentdate)
        setFromDate(currentdate)
        setToDate(currentdate)
    }, [])

    useEffect(() => {
        console.log(fromDate + "  " + toDate + "  " + dayType);
        console.log(leaveType);
    })


    const applyFun = () => {
        axios.post('http://localhost:8081/applyLeave', { emp_id:state.emp_id, fromDate, toDate, dayType, leaveType, remarks, status: 'Pending' })
            .then((result) => {
                console.log(result.data)
                alert("Apply Successfully")
                setFromDate(currentDate)
                setToDate(currentDate)
                setDayType('')
                setLeaveType('')
                setRemarks('')
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        axios.post('http://localhost:8081/getLeaveStatus', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data)
                setLeaveStatus(result.data)
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <>
            <div className="leave-dashboard">
                {/* <div className="header" style={{width:'100%'}}>
                <h2>Hello, {emp.name}</h2>
                <div className='leave-icon'>
                    <img src={leaveIcon} alt="" />
                    <h1 onClick={e=>setLeave_status_class('leave-status visible')}>LeaveIcon</h1>
                    <p>Check Staus</p>
                </div>
            </div> */}
                <div className="content-lable">
                    <p><b>Apply For Leave</b></p>
                    <p>Dashboard <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Leave</span></p>
                </div>

                <div className="leave-details">

                    <div className="balance">
                        <p>Leave Balance : {empLeave.balance_leave}</p>
                    </div>
                    <div className="leave-taken">
                        <p>No. of Leave Taken : {empLeave.total_leave}</p>
                    </div>
                </div>
                <div className="leave-type">
                    <div className="date-block">
                        <div className="from-block">
                            From <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        </div>
                        <div className="to-block">
                            To <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="type-block">
                        <div className="from-block">
                            <button onClick={e => setDayType('Full Day')}>Full Day</button>
                        </div>
                        <div className="to-block">
                            <button onClick={e => { setBtnVisibility('byTime-Class visible') }}>{(!dayType || dayType === 'Full Day') ? 'By Time' : dayType}</button>
                            <div className={btnVisibility} >
                                <button onClick={e => { setDayType('Morning'); setBtnVisibility('hidden') }}>Morning</button>
                                <button onClick={e => { setDayType('Afternoon'); setBtnVisibility('hidden') }}>Afternoon</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="reasons">
                    <select name="" id="" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option >Type of Leave</option>
                        <option value="SickLeave">Sick Leave</option>
                        <option value="EarnedLeave">Earned Leave</option>
                        <option value="UnpaidLeave">Unpaid Leave</option>
                    </select>
                    <div className='remarks'>
                        <label>Remarks: </label><br />
                        <textarea name="" value={remarks} onChange={e => setRemarks(e.target.value)}></textarea>
                    </div>
                    <button className='apply-leave-btn' onClick={applyFun}>Apply</button>
                </div>

                

            </div>
        </>
    )
}

export default LeaveDashboard
