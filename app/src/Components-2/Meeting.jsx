import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Meeting({users, state, date}) {
    const [add_icon, setAddIcon] = useState(false)
    const [meetingHistory, setMeetingHistory] = useState([])
    const [selectedEmpList, setSelectedEmpList] = useState([])

    const [meetingDate, setMeetingDate] = useState('')
    const [meetingType, setMeetingType] = useState('')
    const [meetingTime, setMeetingTime] = useState('')
    const [refresh, setRefresh] = useState(true)
    const [description, setDescription] = useState('')

    

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const result = await axios.post('http://localhost:8081/getMeeting', { emp_id: state.emp_id });
                setMeetingHistory(result.data);
            } catch (error) {
                console.error("Error while getting meetings data:", error);
            }
        };

        fetchMeetings();
    }, [refresh]);

    const deleteFun = (itemToDelete) => {
        setSelectedEmpList(selectedEmpList.filter(item => item !== itemToDelete));
      };

     const clearDetails=()=>{
        setMeetingDate('')
        setMeetingTime('')
        setDescription('')
        setMeetingType('')
        setSelectedEmpList([])

      }
      const scheduleFun=async () => {

        let time= new Date().getHours() +":" + new Date().getMinutes()
        
        if (meetingDate === '' || meetingTime === '' || meetingType === '' || description === '' || selectedEmpList.length === 0) {
            alert('Please fill all Details')
        } else {
            try {
                const result = await axios.post('http://localhost:8081/createMeeting', { emp_id: state.emp_id, name: state.name, mDate:meetingDate,mType:meetingType, mTime:meetingTime,description,empList:selectedEmpList, date , time})
                console.log(result.data)
                alert(meetingType + " is Created")
                setRefresh(!refresh)
                clearDetails()
                
            } catch (error) {
                console.error("Error creating meeting:", error);
                alert("An error occurred while creating user or leave details. Please try again.");
            }
        }

    }
    return (
        <div>
            <div className="greetings">
                <center><h2>Hello, Name</h2></center>
            </div>
            <div className='meeting'>
                <div className="schedule-container">

                    <p style={{ color: '#1e85f1', fontSize: '20px' }}>Schedule New Meeting</p>
                    <div className="schedule-block">

                        <div className="details">
                            <div>
                                <p className='lable'><b>Meeting Date</b></p>
                                <input type="date" className='data' value={meetingDate} onChange={e=>setMeetingDate(e.target.value)}/>
                            </div>
                            <div>
                                <p className='lable'><b>Meeting Time</b></p>
                                <input type="time" className='data' value={meetingTime} onChange={e=>setMeetingTime(e.target.value)}/>
                            </div>
                            <div>
                                <p className='lable'><b>Meeting Type</b></p>
                                <select name="" id="" className='data'value={meetingType} onChange={e=>setMeetingType(e.target.value)} >
                                    <option value="">Select Type</option>
                                    <option value="Project meeting">Project meeting</option>
                                    <option value="Teams meeting">Teams meetings</option>
                                    <option value="Client meeting">Client meeting</option>
                                </select>
                            </div>
                            <div>
                                <p className='lable'><b>Add Employee</b> <i class="fa-solid fa-user-plus" style={{color: '#1e85f1'}} onClick={()=>setAddIcon(true)}></i></p>
                                {add_icon && selectedEmpList?.length>0 &&
                                    <div className='selectList'>
                                        {selectedEmpList.map(item=>(
                                            <p >{item } <span style={{color:'#1e85f1'}}><i class="fa-regular fa-circle-xmark" onClick={()=>deleteFun(item)}></i></span></p>
                                        ))}
                                    </div>}
                            </div>
                            <div className='grid-2'>
                                <p className='lable'><b>Description</b></p>
                                <textarea name="" id="" placeholder='Meeting Description' value={description} onChange={e=>setDescription(e.target.value)}>

                                </textarea>
                            </div>

                        </div>
                        <button onClick={scheduleFun}>Create</button>
                    </div>


                </div>

                <div className="recent-block">
                    {!add_icon && <div className="history">
                        <p style={{ color: '#1e85f1', fontSize: '20px' }}>Recent Meetings </p>
                        <div className="history-data">
                        <table>
                                <thead>
                                    <tr>
                                        <th>Meeting Type</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meetingHistory.map(u=>(
                                        <tr key={u.emp_id} >
                                            <td>{u.mType}</td>
                                            <td>{u.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                              </table>
                        </div>
                    </div>}
                    {add_icon && 
                        <div className="empList">
                            <p style={{padding:'10px'}}><b>Select Employees for Meeting</b></p>
                            <div className="empList-data">
                              <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Emp ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u=>(
                                        <tr key={u.emp_id} onClick={()=>{
                                            if (!selectedEmpList.some(emp => emp === u.emp_id)) {
                                                setSelectedEmpList([...selectedEmpList, u.emp_id]);
                                            }
                                        }}>
                                            <td>{u.name}</td>
                                            <td>{u.emp_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>

                        </div>
                    }

                </div>

            </div>
        </div>
    )
}

export default Meeting