import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ApproveLeave() {
    const [empList, setEmpList] = useState([]);
    const [empId, setEmpId] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dayType, setDayType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [status, setStatus] = useState('');
    const [days, setDays] = useState(0);
    const [statusList, setStatusList] = useState([]);
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8081/getApplyLeave')
            .then(result => {
                console.log(result.data);
                setEmpList(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    const setFun = (item) => {
        setEmpId(item.emp_id);
        setFromDate(item.fromDate);
        setToDate(item.toDate);
        setDayType(item.dayType);
        setLeaveType(item.leaveType);
        setRemarks(item.remarks);
        setStatus(item.status);

        // Calculate days between fromDate and toDate
        const startDate = new Date(item.fromDate);
        const endDate = new Date(item.toDate);
        const calculatedDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        setDays(calculatedDays);

        setDisplay(true);
    };

    const approveFun =(num)=>{
        
        
        if(num===1){
            console.log('approve');
            let set={}
            if((!statusList.some(i => i.empId === empId && i.fdate===fromDate && i.tdate===toDate)) || statusList.length===0){
                set={empId:empId,status:'Approved',fdate:fromDate, tdate:toDate}
                setStatusList([...statusList,set])
            }
            else{
                alert('Already Done')
            }
        }
        else{
            console.log('reject');
            if((!statusList.some(i =>  i.empId === empId && i.fdate===fromDate && i.tdate===toDate) || statusList.length===0)){
                let set={empId:empId,status:'Rejected',fdate:fromDate, tdate:toDate}
                setStatusList([...statusList,set])
            }
            else{
                alert('Already Done')
            }
        }
    }

    const deleteItem = (item) => {
        setStatusList(statusList.filter((i) => !(i.empId === item.empId && i.fdate === item.fdate && i.tdate === item.tdate)));
    };

    const saveFun = async (e) => {
        e.preventDefault();

        if (statusList.length > 0) {
            try {
                console.log("Saving status list:", statusList);

                // Process each item in statusList
                for (const i of statusList) {
                    try {
                        const leaveStatusResult = await axios.put('http://localhost:8081/leaveStatus', {
                            emp_id: i.empId,
                            status: i.status,
                            fromDate: i.fdate,
                            toDate: i.tdate
                        });
                        console.log('Leave status updated:', leaveStatusResult.data);

                        // Assuming 'Approved' status means updating days
                        if ((i.status === 'Approved') || (i.status === 'Rejected')) {
                            const startDate = new Date(i.fdate);
                            const endDate = new Date(i.tdate);
                            const dateArray = [];

                            for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
                                dateArray.push(new Date(dt));
                            }

                            for (const date of dateArray) {
                                try {
                                    const updateDaysResult = await axios.put('http://localhost:8081/updateDays', {
                                        emp_id: i.empId,
                                        date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                                        action: i.status
                                    });
                                    console.log('Working days updated:', updateDaysResult.data);
                                } catch (updateDaysError) {
                                    console.error('Error updating working days:', updateDaysError);
                                }
                            }
                        }
                    } catch (leaveStatusError) {
                        console.error('Error updating leave status:', leaveStatusError);
                    }
                }

                alert("Status updated successfully!");
                setStatusList([]); // Clear statusList after successful update
            } catch (error) {
                console.error('Error saving status:', error);
                alert('An error occurred while saving. Please try again.');
            }
        } else {
            alert("No changes to save.");
        }
    };

    return (
        <>
            <div className='approve-leaves'>
                {/* <div className="header">
                    <h1>Approve Leaves</h1>
                </div> */}
                <div className="section">
                    <div className="leave-list">
                        <div className="table-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee List</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empList.map((item) => (
                                    <tr key={item.emp_id} onClick={() => setFun(item)}>
                                        <td>{item.emp_id}</td>
                                        <td>
                                            <p style={{ backgroundColor: 'rgb(241, 96, 96)', borderRadius: '10px' }}>{item.status}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        {empList.length === 0 && <h1 className='emptyMSG'>Empty Request</h1>}
                    </div>
                    {display && (
                        
                            <div className="leave-subject">
                                <h3>Emp ID : {empId}</h3>
                                <h3>Leave Type : {leaveType}</h3>
                                
                                <div>
                                    <h3>Starting Date : {fromDate}</h3>
                                    <h3>Ending Date : {toDate}</h3>
                                </div>
                                <div>
                                    <h3>Day Type : {dayType}</h3>
                                    <h3>Total Days : {days}</h3>
                                </div>
                                <p className='grid-2'><b>Remark : <br /></b>{remarks}</p>
                                
                                <h1><button onClick={() => approveFun(1)}>Approve</button></h1>
                                <h1><button onClick={() => approveFun(0)}>Reject</button></h1>
                            </div>
                    )}

                        { statusList.length>0 &&
                            <div className="approve-checkbox">
                                <h4 style={{ textAlign: 'center' }}>Marked List</h4>
                                <table>
                                    <tbody>
                                        {statusList.map((i, index) => (
                                            <tr key={index}>
                                                <td>{i.empId}</td>
                                                <td>{i.status}</td>
                                                <td style={{ border: 'none' }}>
                                                    <i className="fa-solid fa-trash-can" onClick={() => deleteItem(i)}></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                </div>
                <form onSubmit={saveFun}>
                    {display && <button id='save'>SAVE</button>}
                </form>
            </div>
        </>
    );
}

export default ApproveLeave;



