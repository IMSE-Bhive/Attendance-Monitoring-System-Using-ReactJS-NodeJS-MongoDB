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

import HolidaysList from './HolidaysList';

import CompanyPolicy from './CompanyPolicy';
import { useLocation } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import PresentLineProgressBar from './PresentLineProgressBar';


function EmployeeDetails({ handleClick, state }) {


    // const location = useLocation()
    // const {state} = location;
    // const emp = state?.emp
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

    const [displayValue, setDisplayValue] = useState(['visible', 'hidden', 'hidden', 'hidden', 'hidden'])


    const sideBarFun = () => {
        setSideBarClass(sideBarStatus ? 'side-bar hidden' : 'side-bar visible');
        setContentSectionClass(sideBarStatus ? 'content-section' : 'content-section with-side-bar');
        setSideBarStatus(!sideBarStatus);
    };

    const [selected, setSelected] = useState(0);

    // const handleClick = (index) => {
    //     setSelected(index);
    //     setDisplayValue(displayValue.map((value, i) => (i === index ? 'visible' : 'hidden')))
    // };

    useEffect(() => {
        // axios.post('http://localhost:8081/getEmployee' ,{emp_id:id})
        //     .then((result) => {
        //         console.log(result.data);
        //         setUser(result.data);
        //     })
        //     .catch(err => console.log(err));

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

        // axios.post('http://localhost:8081/getProgress', { emp_id: state.emp_id })
        //     .then((result) => {
        //         console.log(result.data);
        //         setWeekProgress(result.data.week)
        //         setMonthProgress(result.data.month)
        //         setOverTimeProgress(result.data.overTime)
        //     })
        //     .catch(err => console.log(err));


    }, [state]);

    // useEffect(()=>{

    // },[id])


    const [currentTime, setCurrentTime] = useState('');
    const date = new Date();
    let monthDate = (date.getMonth() + 1).toString().padStart(2, '0');
    let dayDate = date.getDate().toString().padStart(2, '0');
    let currentDate = `${date.getFullYear()}-${monthDate}-${dayDate}`;

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
                setSwipeOutTime(currentTime)
                // updateProgress()
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

    function getWeekDates() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Calculate Monday offset
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(formatDate(date));
        }

        return weekDates;
    }


    function getMonthDates() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const monthDates = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            monthDates.push(formatDate(date));
        }
        return monthDates;
    }


    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const accountSection = () => {
        setAccountSectionClass('account-section')
    }
    const calculateDurationInMinutes = (duration) => {
        const [hours, minutes] = duration.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const [daysProgress, setDaysProgress] = useState({});

      useEffect(() => {
        if (attendance.length > 0) {
          console.log(attendance);

          const calculateDurationInMinutes = (duration) => {
            const [hours, minutes] = duration.split(':').map(Number);
            return hours * 60 + minutes;
          };

          const formatDuration = (totalMinutes) => {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
          };
    
          const weekDates = getWeekDates();
          const weekAttendance = attendance.filter(item => weekDates.includes(item.date));
          const weekTotalMinutes = weekAttendance.reduce((total, item) => {
            const duration = calculateDurationInMinutes(item.duration);
            return total + duration;
          }, 0);
          const weekTotalDuration = formatDuration(weekTotalMinutes);
          console.log(`Week's total duration: ${weekTotalDuration}`);
  
          const monthDates = getMonthDates(); 
          const monthAttendance = attendance.filter(item => monthDates.includes(item.date));
          const monthTotalMinutes = monthAttendance.reduce((total, item) => {
            const duration = calculateDurationInMinutes(item.duration!==""?item.duration : '0:0');
            return total + duration;
          }, 0);
          const monthTotalDuration = formatDuration(monthTotalMinutes);
          console.log(`Month's total duration: ${monthTotalDuration}`);

          const monthOverTimeMinutes = monthAttendance.reduce((total, item) => {
            const duration = calculateDurationInMinutes(item.overTime!==""?item.overTime : '0:0');
            return total + duration;
          }, 0);
          const monthOverTimeDuration = formatDuration(monthOverTimeMinutes);
    
         
          setDaysProgress({  weekTotalDuration, monthTotalDuration,monthOverTimeDuration });
        }
      }, [attendance]);

    
    return (
        <>
            <div className="dashboard  ">
                <div className="content-lable">
                    <button style={{
                        position: 'absolute', right: '10px', padding: '5px 10px', borderRadius: '5px',
                        outline: 'none', border: '1px solid #1e81ea'
                    }} onClick={() => {handleClick(1)}}>Back</button>
                    <p><b>Attendance <span className='small light'>({state.emp_id})</span></b></p>
                    <p>Dashboard <span style={{ color: 'rgba(4, 4, 4, 0.439)' }}>/Attendance</span></p>
                </div>
                <div className="content-lable-section">
                    <div className="section-1">
                        <div className="container">
                            <p className='block-heading'><b>Timesheet </b> <span className=' small'>11 Mar 2024</span></p>
                            <div className='punchin-lable'>
                                <p><b>Punch In at</b></p>
                                <p className='small light'>{swipeInTime ? (`${new Date().toDateString()} ${swipeInTime}`) : 'You have not swiped in'}</p>
                            </div>
                            <div className="timmer-block">
                                <div className="timmer">
                                    <CountdownTimer durationCompleted={duration} path_color='#3e98c7' />


                                </div>
                                <div className="punch">
                                    {(swipeInBtn && !swipeInTime) && <button onClick={loginFun}>Punch In</button>}
                                    {(!swipeInBtn || swipeInTime) && <button onClick={logoutFun}>Punch Out</button>}
                                </div>
                            </div>
                            <div className='extra-time'>
                                <p style={{ borderRight: '1px solid rgba(0, 0, 0, 0.215)' }}>Break <br /><span className='small light'>1 hour</span></p>
                                <p>Overtime <br /> <span className='small light'>{overTime}</span></p>
                            </div>
                        </div>
                        <div className="container statistics">
                            <p className='block-heading'><b>Statistics</b></p>
                            <div className="today lineProgress">
                                <div className='progress-content'>
                                    <p>Today</p>
                                    <p><b>{duration}/9</b> hr</p>
                                </div>
                                <LineProgressBar completed={duration} total={9} />
                            </div>

                            <div className="week lineProgress">
                                <div className='progress-content'>
                                    <p>This Week</p>
                                    <p><b>{daysProgress.weekTotalDuration}/45</b> hr</p>
                                </div>
                                <LineProgressBar completed={daysProgress?.weekTotalDuration} total={45} />
                            </div>

                            <div className="month lineProgress">
                                <div className='progress-content'>
                                    <p> This Month</p>
                                    <p><b>{daysProgress?.monthTotalDuration}/180</b> hr</p>
                                </div>
                                <LineProgressBar completed={daysProgress?.monthTotalDuration} total={180} />
                            </div>

                            <div className="overTime lineProgress">
                                <div className='progress-content'>
                                    <p>OverTime</p>
                                    <p><b>{daysProgress?.monthOverTimeDuration}/20</b> hr</p>
                                </div>
                                <LineProgressBar completed={daysProgress?.monthOverTimeDuration} total={20} />
                            </div>

                        </div>
                        <div className="container">
                            <p className='block-heading'><b>Calendar</b></p>
                            <div className="calendar-block" style={{ lineHeight: '35px',width:'100%' , display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <div style={{width:"80%"}}>
                                    <Calender id={state.emp_id}  />
                                </div>
                                <div className="section-3">
                                    <div className="legends green">
                                        <h1></h1><p>Present</p>
                                    </div>
                                    <div className="legends red">
                                        <h1></h1><p>Absent</p>
                                    </div>
                                    <div className="legends yellow">
                                        <h1></h1><p>Leave</p>
                                    </div>
                                    <div className="legends blue">
                                        <h1></h1><p>Holiday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section-2">
                        <div className="attendance-list">
                            <p className='block-heading' > <b>Attendance List</b></p>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ borderLeft: 'none' }}>S.No</th>
                                        <th>Date</th>
                                        <th>Punch In</th>
                                        <th>Punch Out</th>
                                        <th>Production</th>
                                        <th>Break</th>
                                        <th style={{ borderRight: 'none' }}>Overtime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.slice(-5).reverse().map((item, key) => (
                                        <tr key={key}>
                                            <td style={{ borderLeft: 'none' }}>{key + 1}</td>
                                            <td>{item.date}</td>
                                            <td>{item.login}</td>
                                            <td>{item.logout}</td>
                                            <td>{item.duration}</td>
                                            <td> 1 hour</td>
                                            <td style={{ borderRight: 'none' }}>0 hour</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className=" daily-records">
                            <p className='block-heading'><b>Daily Records</b></p>
                            <div className="daily-records-block">
                                {getMonthDates()?.filter(i => i <= currentDate).reverse().map(d => (
                                    <div className="bars-data">
                                        <p>{d.slice(-2)}</p>
                                        <div className="bars">
                                            <PresentLineProgressBar completed={attendance.find(emp => emp.date === d)?.duration.split(':').join('.') } total={9} getColor='#80debb' getBaseBgColor='' />
                                            <PresentLineProgressBar completed={9 - attendance.find(emp => emp.date === d)?.duration.split(':').join('.') } total={9} getColor='#1c85f1' getBaseBgColor='' />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeDetails