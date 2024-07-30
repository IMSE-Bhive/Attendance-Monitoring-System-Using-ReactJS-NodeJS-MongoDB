import React, { useContext, useEffect, useState } from 'react';
import logo from '../Assets/immensphereLogo.png';
import axios from 'axios';
import Calender from './Calender';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CountdownTimer from './CountdownTimer';
import LineProgressBar from './LineProgressBar';
import LeaveProgressBar from './LeaveProgressBar';
import { AppContext } from '../context/AppContext';
import LeaveDashboard from './LeaveDashboard';
import HolidaysList from './HolidaysList';
import LeaveStatus from './LeaveStatus';
import CompanyPolicy from './CompanyPolicy';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeDetails from './EmployeeDetails';
import DefaultEmp from './DefaultEmp';
import Report from './Report';
import TicketDashboard from './TicketDashboard';

function EmployeeDashboard() {
    const navigate = useNavigate()
    // const { user } = useContext(AppContext)
    // if (user) {
    //     console.log(user);
    // }
    // const { id } = user.emp_id;
    const [user, setUser] = useState([]);

    const location = useLocation()
    const { state } = location;
    const emp = state?.emp
    console.log(state)
    const [leave, setLeave] = useState({});
    const [attendance, setAttendance] = useState([]);
    const [leaveCollection, setLeaveCollection] = useState({});
    const [applyLeave, setApplyLeave] = useState([]);
    const [empLeave, setEmpLeave] = useState([])

    const [swipeInBtn, setSwipeInBtn] = useState(true);
    const [swipeInTime, setSwipeInTime] = useState('');
    const [swipeOutTime, setSwipeOutTime] = useState('');
    const [duration, setDuration] = useState('0:0');
    const [overTime, setOverTime] = useState('0 hour');
    const [weekProgress, setWeekProgress] = useState('');
    const [monthProgress, setMonthProgress] = useState('');
    const [overTimeProgress, setOverTimeProgress] = useState('');

    const [side_bar_class, setSideBarClass] = useState('side-bar visible');
    const [content_section_class, setContentSectionClass] = useState('content-section with-side-bar');
    const [sideBarStatus, setSideBarStatus] = useState(false);
    const [account_section_class, setAccountSectionClass] = useState('hidden')
    const [notification_class, setNotificationClass] = useState('hidden')

    const [displayValue, setDisplayValue] = useState(['visible', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden'])
    //const [displayValue, setDisplayValue] = useState([ 'hidden', 'hidden','visible', 'hidden', 'hidden', 'hidden'])

    const sideBarFun = () => {
        setSideBarClass(sideBarStatus ? 'side-bar hidden' : 'side-bar visible');
        setContentSectionClass(sideBarStatus ? 'content-section' : 'content-section with-side-bar');
        setSideBarStatus(!sideBarStatus);
    };

    const [selected, setSelected] = useState(0);

    const handleClick = (index) => {
        setSelected(index);
        setDisplayValue(displayValue.map((value, i) => (i === index ? 'visible' : 'hidden')))
    };

    useEffect(() => {
        axios.get('http://localhost:8081/getUser')
            .then((result) => {
                console.log(result.data);
                setUser(result.data);
            })
            .catch(err => console.log(err));

        axios.post('http://localhost:8081/getAttendance', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data);
                setAttendance(result.data);
            })
            .catch(err => console.log(err));

        axios.post('http://localhost:8081/getLeaveStatus', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data)
                setEmpLeave(result.data)
            })
            .catch(err => console.log(err))

        axios.post('http://localhost:8081/getLeave', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data);
                setLeaveCollection(result.data);
            })
            .catch(err => console.log(err));

        axios.post('http://localhost:8081/getProgress', { emp_id: state.emp_id })
            .then((result) => {
                console.log(result.data);
                setWeekProgress(result.data.week)
                setMonthProgress(result.data.month)
                setOverTimeProgress(result.data.overTime)
            })
            .catch(err => console.log(err));


    }, [state]);

    // useEffect(()=>{

    // },[id])


    const [currentTime, setCurrentTime] = useState('');
    let date = new Date();
    let month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    let currentDate = date.getFullYear() + '-' + month + '-' + date.getDate();

    // useEffect(() => {
    //     let date = new Date();
    //     let hour = date.getHours();
    //     let meridiem = hour < 12 ? 'AM' : 'PM';
    //     let formattedHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    //     setCurrentTime(`${formattedHour}:${String(date.getMinutes()).padStart(2, '0')} ${meridiem}`);
    // },[currentTime]);

    useEffect(() => {
        const updateCurrentTime = () => {
            let date = new Date();
            let hour = date.getHours();
            let meridiem = hour < 12 ? 'AM' : 'PM';
            let formattedHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            setCurrentTime(`${formattedHour}:${String(date.getMinutes()).padStart(2, '0')} ${meridiem}`);
        };

        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (attendance.length > 0) {
            const recent = attendance[attendance.length - 1];
            if (currentDate === recent.date) {
                setSwipeInTime(recent.login);
                setSwipeOutTime(recent.logout);
                setSwipeInBtn(false);
            }
        }
    }, [attendance, currentDate]);

    const updateLogin = () => {
        axios.post('http://localhost:8081/createAttendance', { emp_id: state.emp_id, date: currentDate, login: currentTime, logout: '' })
            .then((result) => {
                if (!result.data.message) {
                    alert("Swipe In Successfully");
                    setSwipeInTime(result.data.login);
                    setSwipeInBtn(false);
                    if (!result.data.error) {
                        axios.put('http://localhost:8081/updateDays', { emp_id: state.emp_id, date: currentDate, action: "swipeIn" })
                            .then((result1) => {
                                console.log(result1.data);
                            })
                            .catch((err1) => {
                                console.error('Error updating working days:', err1);
                            });
                    }
                } else {
                    alert("Already Swiped In");
                }
            })
            .catch(err => console.log(err));
    }

    const loginFun = () => {
        let date = new Date()
        let [presentHour, presentMinute] = [date.getHours(), date.getMinutes()].map(Number)
        console.log(date);
        console.log(presentHour);
        console.log(presentMinute);
        if (presentHour < 9) {
            alert("You not suppose to login Early")
        } else {
            updateLogin()
        }
    };

    const convertToMiliSeconds = (str) => {
        let [strHour, strMinute] = str.split(':').map(Number)
        return (strHour * 3600) + (strMinute * 60)
    }
    const convertToHour = (num) => {
        let h = Math.floor(num / (60 * 60))
        let m = Math.floor((num % (60 * 60)) / (60))
        return `${h}:${m}`
    }
    const progressFun = (w, m, o) => {
        axios.put('http://localhost:8081/updateProgress', { emp_id: state.emp_id, week: w, month: m, overTime: o })
            .then((result) => {
                console.log(result.data)
            })
            .catch(err => console.log(err))

    }
    const updateProgress = () => {
        let [dHour, dMinute] = duration.split(':').map(Number)
        let todayHour, todayOverTime
        if (dHour < 9) {
            todayHour = convertToMiliSeconds(duration)
            todayOverTime = 0
        } else {
            todayHour = 9 * 3600
            todayOverTime = convertToMiliSeconds(duration) - (9 * 3600)
        }
        console.log("todayHour - " + todayHour);
        console.log("todayMinute - " + todayOverTime);

        let totalWeekMs = weekProgress ? convertToMiliSeconds(weekProgress) + todayHour : todayHour
        let totalMonthMs = convertToMiliSeconds(monthProgress) + todayHour
        let totalOverTimeMs = convertToMiliSeconds(overTimeProgress) + todayOverTime

        // console.log(duration);
        // console.log(totalWeekMs);
        // console.log(totalMonthMs);
        // console.log(totalOverTimeMs);

        let totalWeekHour = convertToHour(totalWeekMs)
        let totalMonthHour = convertToHour(totalMonthMs)
        let totalOverTimeHour = convertToHour(totalOverTimeMs)
        console.log('updating progress--------------------------------');
        progressFun(totalWeekHour, totalMonthHour, totalOverTimeHour)
        // console.log(totalWeekHour);
        // console.log(totalMonthHour);
        // console.log(totalOverTimeHour);
    }

    const updateLogout = () => {
        axios.put('http://localhost:8081/updateLogout', { emp_id: state.emp_id, date: currentDate, logout: currentTime, duration: duration })
            .then((result) => {
                console.log(result.data)
                alert("Swipe Out Successfully")
                setSwipeInBtn(true)
                updateProgress()
            })
            .catch(err => console.log(err))
    }
    const logoutFun = () => {
        if (!swipeOutTime) {
            const [totalHour, totalMinute] = duration.split(':').map(Number);
            console.log(totalHour + "---" + totalMinute);
            if (totalHour < 9) {
                let enterValue = window.confirm('Are you sure you want to swipe out early?');
                if (enterValue) {
                    updateLogout()
                    console.log("logout Successgully");
                }
            } else {
                updateLogout()
                console.log("logout Successgully");
            }
        } else {
            alert("You Already Swipe Out Successfully")
        }

    }

    useEffect(() => {
        if (!swipeInTime) return;

        const [loginHour, loginMinute] = swipeInTime.split(' ')[0].split(':').map(Number);
        const loginMeridiem = swipeInTime.split(' ')[1];
        const currentTimeToUse = swipeOutTime ? swipeOutTime : currentTime;
        const [currentHour, currentMinute] = currentTimeToUse.split(' ')[0].split(':').map(Number);
        const currentMeridiem = currentTimeToUse.split(' ')[1];

        const loginDate = new Date();
        loginDate.setHours(loginMeridiem === 'PM' && loginHour !== 12 ? loginHour + 12 : loginHour);
        loginDate.setMinutes(loginMinute);

        const currentDate = new Date();
        currentDate.setHours(currentMeridiem === 'PM' && currentHour !== 12 ? currentHour + 12 : currentHour);
        currentDate.setMinutes(currentMinute);

        const calculateDuration = () => {
            const durationMs = currentDate - loginDate;
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            setDuration(`${durationHours}:${String(durationMinutes).padStart(2, '0')}`);
            console.log(`${durationHours} hours, ${durationMinutes} minutes`);

            if (durationHours >= 9) {
                calculateOverTime(durationHours, durationMinutes);
            }
        };

        const calculateOverTime = (durationHours, durationMinutes) => {
            const overHours = durationHours - 9;
            const overMinutes = durationMinutes;

            console.log(`Overtime: ${overHours}:${overMinutes} hour`);
            setOverTime(`${overHours}:${overMinutes} hour`)
        };

        calculateDuration();
    }, [swipeInTime, swipeOutTime, currentTime]);


    const accountSection = () => {
        setAccountSectionClass('account-section')
    }

    const [selectedUser, setSelectedUser] = useState({})
    const [logFlag, setLogFlag] = useState(false);
    const [emp_table_body_class, setEmp_table_body] = useState('emp-table_body')

    const selectUserFun = (item) => {
        setSelectedUser(item);
        console.log(selectedUser);
        handleClick(5)
        // setLogFlag(true);  
    }

    const createFun=()=>{

    }
    // useEffect(()=>{
    //     if(logFlag){
    //         console.log(selectedUser);
    //         handleClick(5)
    //     }
    // },[selectedUser])
    return (
        <>
            <div className="emp-dashboard">
                <div className="header">
                    <div className="img-div">
                        <img src={logo} alt="" />
                    </div>
                    <div className="header-content">
                        <i className="fa-solid fa-bars" onClick={sideBarFun}></i>
                        <div className='user-account'>

                            <div className="search-bar">
                                <input type="text" placeholder='search here...' />
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>

                            <i className="fa-regular fa-bell"></i>
                            <i className="fa-regular fa-comment" onClick={e => {
                                if (account_section_class !== 'hidden') {
                                    setAccountSectionClass('hidden')
                                }
                                setNotificationClass('notification')
                            }}></i>
                            <div className={notification_class}>
                                <div className="notification-heading block-heading">
                                    <b style={{ fontSize: '20px' }}> Notification</b>
                                </div>
                                <div className="notification-content" style={{ fontSize: '12px' }}>
                                    {empLeave.map((item) => (item.status !== 'Pending' ?
                                        <div style={{ display: 'grid', gridTemplateColumns: '170px 40px', gap: '20px', padding: '10px', borderBottom: '1px solid rgba(0, 0, 0, 0.187' }}>
                                            <p>
                                                <b>HR</b> has {item.status} your leave Request

                                            </p>
                                            <p>{item.fromDate.slice(5)}</p>
                                        </div> : ''))}
                                </div>

                            </div>

                            <i className="fa-solid fa-rotate" onClick={e => navigate('/landingPage', { state })}></i>

                            <div className="user-icon">
                                <div class='circle' onClick={accountSection}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTlBWrqkcAQADicgAlj-cH4f3sRrIzHcee7w&s" alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                </div>


                            </div>
                            <div className={account_section_class}>
                                <div className='layout-1'></div>
                                <div className='circle' style={{ width: '100px', height: '100px' }}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTlBWrqkcAQADicgAlj-cH4f3sRrIzHcee7w&s" alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                </div>
                                <p><b>{state.name}</b></p>
                                <p>{state.emp_id}</p>
                                <div className='layout-2' style={{ marginTop: '20px' }}>
                                    <h3>Category</h3>
                                    <h3>:</h3>
                                    <p>{state.category}</p>
                                    <h3>Designation</h3>
                                    <h3>:</h3>
                                    <p>{state.designation}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="section " onClick={e => {
                    if (account_section_class !== 'hidden') {
                        setAccountSectionClass('hidden')

                    }
                    if (notification_class !== 'hidden') {
                        setNotificationClass('hidden')
                    }

                }}>
                    <div className={side_bar_class}>
                        <div className="sidebar-block">
                            <h3>Main</h3>
                            <div className="main">
                                <p onClick={() => handleClick(0)}

                                    style={{
                                        backgroundColor: selected === 0 ? '#ffffff' : 'transparent',
                                        color: selected === 0 ? '#1e85f1' : 'rgba(255, 255, 255, 0.854)'
                                    }}>Dashboard</p>
                            </div>
                            <br />
                            <h3>Employee</h3>
                            <div className='employee-block'>
                                <p onClick={() => handleClick(1)}
                                    style={{
                                        backgroundColor: selected === 1 ? '#ffffff' : 'transparent',
                                        color: selected === 1 ? '#1e85f1' : 'rgba(255, 255, 255, 0.854)'
                                    }}>Employees</p>
                                <p onClick={() => handleClick(2)}
                                    style={{
                                        backgroundColor: selected === 2 ? '#ffffff' : 'transparent',
                                        color: selected === 2 ? '#1e85f1' : 'rgba(255, 255, 255, 0.854)'
                                    }}>Tickets</p>
                                <p onClick={() => handleClick(3)}
                                    style={{
                                        backgroundColor: selected === 3 ? '#ffffff' : 'transparent',
                                        color: selected === 3 ? '#1e85f1' : 'rgba(255, 255, 255, 0.854)'
                                    }}>Reports</p>
                                <p onClick={() => handleClick(4)}
                                    style={{
                                        backgroundColor: selected === 4 ? '#ffffff' : 'transparent',
                                        color: selected === 4 ? '#1e85f1' : 'rgba(255, 255, 255, 0.854)'
                                    }}>Meetings</p>
                            </div>
                        </div>
                    </div>
                    <div className={content_section_class}>
                        <div className={displayValue[0]}>
                            <DefaultEmp state={state} />

                        </div>

                        {/* ------------------------------------------- */}

                        <div className={displayValue[1]}>

                            <div className="content-lable">
                                <p><b>Employees</b></p>
                                <p>Dashboard <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Employees</span></p>
                                {emp_table_body_class!=='hidden' && <i class="fa-solid fa-plus" style={{ position: 'absolute', right: '1rem', marginTop: '-20px', fontSize: '30px' }}
                                    onClick={() => { setEmp_table_body('hidden') }}></i>}
                                {emp_table_body_class==='hidden' && <button  style={{ position: 'absolute', right: '1rem', marginTop: '-20px', fontSize: '15px' , padding:'3px 6px' }}>Back</button>}
                            </div>
                            <div className={emp_table_body_class}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Emp Name</th>
                                            <th>Emp ID</th>
                                            <th>Category</th>
                                            <th>Designation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user?.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                                            <tr key={item._id} onClick={e => {
                                                selectUserFun(item)
                                            }}>
                                                <td>{item.name}</td>
                                                <td>{item.emp_id}</td>
                                                <td>{item.category}</td>
                                                <td style={{ display: 'flex', justifyContent: 'space-between' }}><p>{item.designation}</p> <p>Edit</p> </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {
                                emp_table_body_class==='hidden' && 
                                <div className="create">
                                <p style={{fontSize:'20px', padding:'10px'}}>Creating new Employee</p>
                                <div className="form">

                                    <form action=""  >
                                        
                                            <input type="text" placeholder='Name' /><br /><br />
                                            <input type="email" placeholder='Email' /><br /><br />
                                            <input type="password" placeholder='Create Password' /><br /><br />
                                            <select  >
                                                <option value="">Select Designation</option>
                                                <option value="Network Administrator">Network Administrator</option>
                                                <option value="User Experience Designer">User Experience Designer</option>
                                                <option value="Database Administrator">Database Administrator</option>
                                                <option value="Full-Stack Developer">Full-Stack Developer</option>
                                                <option value="Data Scientist">Data Scientist</option>
                                                <option value="Cloud Engineer">Cloud Engineer</option>
                                                <option value="Testing Engineer">Testing Engineer</option>
                                            </select><br /><br />
                                            <select  >
                                                <option value="">Select Designation</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Employee">Employee</option>
                                                <option value="Manager">Manager</option>
                                                
                                            </select>
                                            <br /><br />
                                        <div className='center'>
                                            <button onClick={createFun}>create</button></div>
                                    </form>
                                </div>
                            </div>
                            }
                        </div>

                        <div className={displayValue[2]}>

                            {/* <HolidaysList /> */}
                            <TicketDashboard />
                        </div>

                        <div className={displayValue[3]} state={state}>

                            {/* <LeaveStatus empLeave={empLeave} /> */}
                            <Report />
                        </div>

                        <div className={displayValue[4]}>
                            {/* <div className="content-lable">
                                <p><b>Company Policy</b></p>
                                <p>Dashboard <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Policy</span></p>
                            </div>

                            <CompanyPolicy /> */}
                        </div>
                        <div className={displayValue[5]}>
                            <EmployeeDetails handleClick={handleClick} state={selectedUser} setSelectedUser={setSelectedUser} />

                            {/* <LeaveDashboard handleClick={handleClick}  state={state}/> */}
                        </div>




                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeDashboard;
