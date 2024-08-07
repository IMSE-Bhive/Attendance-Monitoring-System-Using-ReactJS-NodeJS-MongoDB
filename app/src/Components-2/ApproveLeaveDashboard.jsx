import axios from 'axios';
import React, { useEffect, useState } from 'react'
import userlogo from '../Assets/userLogo.png';
function ApproveLeaveDashboard({ users }) {

    // const [empId, setEmpId] = useState('');
    // const [leaveType, setLeaveType] = useState('');
    // const [fromDate, setFromDate] = useState('');
    // const [toDate, setToDate] = useState('');
    // const [dayType, setDayType] = useState('');
    // const [remarks, setRemarks] = useState('');
    // const [status, setStatus] = useState('');
    // const [days, setDays] = useState(0);
    // const [statusList, setStatusList] = useState([]);

    const [leaveList, setleaveList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selected, setSelected] = useState(1)
    const [filter, setFilter] = useState('Pending')



    useEffect(() => {
        const fetchLeaveList = async () => {
            try {
                const result = await axios.get('http://localhost:8081/getApplyLeave')
                setleaveList(result.data);
            } catch (error) {
                console.error("Error while getting leaves data:", error);
            }
        };

        fetchLeaveList();
    }, [refresh]);

    const handleClick = (click, data) => {
        setSelected(click);
        setFilter(data)
    }

    const updateFun = async (item, status) => {
        try {
            const leaveStatusResult = await axios.put('http://localhost:8081/leaveStatus', {
                emp_id: item.emp_id,
                status: status,
                fromDate: item.fromDate,
                toDate: item.toDate
            });
            console.log('Leave status updated:', leaveStatusResult.data);

            // Assuming 'Approved' status means updating days

            const startDate = new Date(item.fromDate);
            const endDate = new Date(item.toDate);
            const dateArray = [];

            for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
                dateArray.push(new Date(dt));
            }

            for (const date of dateArray) {
                try {
                    const updateDaysResult = await axios.put('http://localhost:8081/updateDays', {
                        emp_id: item.emp_id,
                        date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                        action: status
                    });
                    console.log('Working days updated:', updateDaysResult.data);
                } catch (updateDaysError) {
                    console.error('Error updating working days:', updateDaysError);
                }
            }
            setRefresh(!refresh)
            let msg= `HR has ${status} your leave Request`
            try {
                const sendNotificationResult = await axios.post('http://localhost:8081/notifications',{emp_id:item.emp_id, msg})
            } catch (sendNotificationError) {
                
            }

        } catch (leaveStatusError) {
            console.error('Error updating leave status:', leaveStatusError);
        }
    };

    return (
        <div className='approveLeave-dashboard'>

            <div >
                <p><b>Leave Request <span style={{fontSize:'11px'}}> ( {leaveList?.filter(l=>l.status==='Pending')?.length??0 } leave Request )</span></b></p>
                <div className="content-lable-heading" >

                    <p>Employee<span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/ Leaves</span></p>
                    <div className="filter">
                        <p style={{
                            backgroundColor: selected === 1 ? '#1e81ea' : ''
                        }}
                            onClick={() => handleClick(1, 'Pending')}>Pending</p>

                        <p style={{
                            backgroundColor: selected === 2 ? '#1e81ea' : ''
                        }}
                            onClick={() => handleClick(2, 'Approved')}>Approve</p>
                        <p style={{
                            backgroundColor: selected === 3 ? '#1e81ea' : ''
                        }}
                            onClick={() => handleClick(3, 'Rejected')}>Rejected</p>
                    </div>
                </div>

            </div>

            <div className="leaveRequest-block">
                {leaveList.filter(f => f.status === filter).map(item => (
                    <div className="leaveRequest">
                        <div className='block-1'>
                            <div className="block-1-grid">
                                <div>
                                    <p className='lable' style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                         <img src={userlogo} alt="" />{users?.find((u) => u.emp_id === item.emp_id)?.name} </p>
                                    <p style={{ paddingLeft: '4px' }}>You have <span style={{color:'#1e81ea'}}>2 leave</span>  in your account</p>
                                </div>
                                <div>
                                    <p className='lable'>LeaveType</p>
                                    <p className='data flex'><h1></h1> {item.leaveType}</p>

                                </div>
                                <div >
                                    <p className='lable'>Day Type</p>
                                    <p className='data'>{item.dayType}</p>
                                </div>
                                <div >
                                    <p className='lable'>No. Days</p>
                                    <p className='data'>{Math.floor((new Date(item.toDate) - new Date(item.fromDate)) / (1000 * 60 * 60 * 24) + 1)}</p>
                                </div>

                                <div>
                                    <p className='lable'>From Date</p>
                                    <p className='data border' style={{ maxWidth: '120px' }}>{item.fromDate}</p>
                                </div>
                                <div>
                                    <p className='lable'>To Date</p>
                                    <p className='data border' style={{ maxWidth: '120px' }}>{item.toDate}</p>
                                </div>
                                <div className='grid-2 remark'>
                                    <p className='lable'>remark</p>
                                    {item.remarks && <p className='data '>{item.remarks}</p>}
                                </div>
                            </div>
                            {filter === 'Pending' && <div>
                                <button id='approve' onClick={() => updateFun(item, 'Approved')} >Approve</button>
                                <button id='reject' onClick={() => updateFun(item, 'Rejected')} >Reject</button>
                            </div>}

                        </div>

                        <div className='block-2'>
                            <center><p><b>{item.status}</b></p></center>
                        </div>

                    </div>
                ))}


            </div>


        </div>
    )
}

export default ApproveLeaveDashboard